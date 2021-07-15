"use strict";
const User = require("../models/user");
const Loan = require("../models/loan"); //needed to get loans associated with the current user
const bcrypt = require("bcryptjs");
const paystack = require("../utils/paystack");
const resp = require("../utils/api-response");
const validations = require("../utils/validations");
const tokenUtil = require("../utils/tokenUtil");

let message;

let users = {
  register: async (req, res) => {
    const { username, email, password } = req.body;

    validations.validateUserRegistration(req, res);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        message = `Email is already registered`;
        return resp.failedResponse(409, res, message);
      }

      let existingUsername = await User.findOne({ username });
      if (existingUsername) {
        message = `Username already taken.`;
        return resp.failedResponse(409, res, message);
      }

      //Encrypt user password before saving to database
      let encryptedPassword = await bcrypt.hash(password, 10);

      let userData = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      // Create token
      const token = tokenUtil.createToken(userData._id);

      // send back user details excluding password
      const result = await User.findOne({ email }, { password: 0 });

      message = "Registration successful";
      return resp.authResponse(200, res, result, message, token);
    } catch (err) {
      return resp.errorResponse(500, res, err);
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    validations.validateUserLogin(req, res);

    try {
      //check if email exists
      const user = await User.findOne({ email });
      if (!user) {
        message = `Email '${email}' is not registered`;
        return resp.failedResponse(404, res, message);
      }

      //check if password matches the provided one
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        message = "Provided password does not match";
        return resp.failedResponse(400, res, message);
      }

      // Create token if credentials are correct
      let token;
      if (user && isPasswordMatch) {
        // Create token
        token = tokenUtil.createToken(user._id);
      }
      // send back user details excluding password
      const result = await User.findOne({ email }, { password: 0 });

      message = "Signed In successfully";
      return resp.authResponse(200, res, result, message, token);
    } catch (err) {
      return resp.failedResponse(500, res, err);
    }
  },

  addLoan: async (req, res) => {
    let { amount_requested } = req.body;
    let { email, _id } = req.user;

    validations.validateAddLoan(req, res);

    try {
      let loanData = new Loan({
        amount_requested,
        amount_remaining: amount_requested,
        owner_email: email,
        owner_id: _id,
        initiator: email,
      });

      const result = await loanData.save();

      message = "Loan request created successfully";
      return resp.successResponse(200, res, result, message);
    } catch (err) {
      return resp.errorResponse(500, res, err);
    }
  },

  getLoans: async (req, res) => {
    let { email } = req.user;

    try {
      const result = await Loan.find({ owner_email: email }).exec();
      if (result.length <= 0) {
        message = "Loans Not found";
        return resp.successResponse(200, res, result, message);
      }

      message = "Successful";
      return resp.successResponse(200, res, result, message);
    } catch (err) {
      return resp.errorResponse(500, res, err);
    }
  },

  getOneLoan: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Loan.findById(id).exec();
      if (!result) {
        message = `Loan with id ${id} is not found`;
        return resp.failedResponse(404, res, message);
      }
      message = "Loan data fetched successfully";
      return resp.successResponse(200, res, result, message);
    } catch (err) {
      return resp.errorResponse(500, res, err);
    }
  },

  repayLoan: async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const { reference } = req.body.response;

    validations.validateLoanRepayment(req, res);

    try {
      const findLoan = await Loan.findById(id).exec();

      if (findLoan) {
        let isAnyError = validations.validateLoanRequirements(
          findLoan,
          amount,
          res
        );

        if (isAnyError) {
          message = "Payment Error, contact customer care";
          return resp.failedResponse(422, res, message);
        }
      } else {
        message = "This loan does not exist.";
        return resp.failedResponse(404, res, message);
      }
      const { amount_requested, amount_paid } = findLoan;

      // confirm from paystack if the initiated transaction (payment) is valid
      const isPaymentValid = await paystack.checkPaymentFromPaystack(
        amount_requested,
        reference,
        res
      );

      let updatedPaidAmount = Number(amount_paid) + Number(amount); //add existing payment with new payment to make it the updatedPaidAmount
      let amountRemaining =
        Number(amount_requested) - Number(updatedPaidAmount); //remove the updatedPaidAmount from the original loan amount to make it the new balance to be paid
      let isRepaid =
        Number(updatedPaidAmount) === Number(amount_requested) ? true : false;

      //update record in the database if payment is valid
      if (isPaymentValid) {
        let dataToUpdate = {
          isRepaid,
          amount_paid: updatedPaidAmount,
          amount_remaining: amountRemaining,
        };
        const result = await Loan.findByIdAndUpdate(id, dataToUpdate, {
          useFindAndModify: false,
        }).exec();

        message = `Loan repayment of ${amount.toLocaleString()} was successful.`;
        return resp.successResponse(200, res, result, message);
      } else {
        message = "Loan repayment was not successful.";
        return resp.failedResponse(422, res, result, message);
      }
    } catch (err) {
      return resp.errorResponse(500, res, err);
    }
  },
};

module.exports = users;
