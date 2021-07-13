"use strict";
const Loan = require("../models/loan");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const resp = require("../utils/api-response");
const validations = require("../utils/validations");
const tokenUtil = require("../utils/tokenUtil");

let message;

let admin = {
  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      validations.validateAdminRegistration(req, res);

      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        message = `Email is already registered`;
        return resp.failedResponse(409, res, message);
      }

      let existingUsername = await Admin.findOne({ username });
      if (existingUsername) {
        message = `Username already taken.`;
        resp.failedResponse(409, res, message);
        return;
      }

      //Encrypt user password before saving to database
      let encryptedPassword = await bcrypt.hash(password, 10);

      let adminData = await Admin.create({
        username,
        email,
        password: encryptedPassword,
      });

      // Create token
      const token = tokenUtil.createToken(adminData._id);

      // send back user details excluding password
      const result = await Admin.findOne({ email }, { password: 0 });

      message = "Registration successful";
      resp.authResponse(200, res, result, message, token);
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    validations.validateAdminLogin(req);

    try {
      //check if email exists
      const user = await Admin.findOne({ email });
      if (!user) {
        message = `Email '${email}' is not registered`;
        resp.failedResponse(404, res, message);
        return;
      }
      //check if password matches the provided one
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        message = "Provided password does not match";
        resp.failedResponse(400, res, message);
        return;
      }

      // Create token if credentials are correct
      let token;
      if (user && isPasswordMatch) {
        // Create token
        token = tokenUtil.createToken(user._id);
      }

      // send back user details excluding password
      const result = await Admin.findOne({ email }, { password: 0 });

      message = "Signed In successfully";
      resp.authResponse(200, res, result, message, token);
    } catch (err) {
      resp.failedResponse(500, res, err);
    }
  },
  addLoan: async (req, res) => {
    let { amount_requested, owner, email } = req.body;

    validations.validateAdminAddLoan(req);

    try {
      let loanData = new Loan({
        amount_requested,
        owner,
        email,
      });

      const result = await loanData.save();
      console.log(result);
      
      if (result) {
        message = "Loan request created successfully";
        resp.successResponse(200, res, result, message);
        return;
      }
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  getLoans: async (req, res) => {
    try {
      const result = await Loan.find({}).exec();
      message = "Successful";
      resp.successResponse(200, res, result, message);
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  getOneLoan: async (req, res) => {
    const { id } = req.params;
    try {
      // if(typeof req.header('Authorization') !== undefined){  //check if bearer is undefined
      // const token = req.header('Authorization').replace('Bearer ', '')
      // const user = jwt.verify(token, process.env.JWT_KEY)
      const result = await Loan.findById(id).exec();
      if (!result) {
        message = `Loan with id ${id} is not found`;
        resp.failedResponse(404, res, message);
        return;
      }
      message = "Loan data fetched successfully";
      resp.successResponse(200, res, result, message);
      // } else {
      // 	response.sendStatus(403); //forbidden
      // }
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  updateLoan: async (req, res) => {
    const { id } = req.params;
    if (!req.body) {
      message = "No data provided, please provide data";
      resp.failedResponse(400, res, message);
    }

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        message = `Loan with id ${id} not found`;
        resp.failedResponse(404, res, message);
        return;
      } else {
        message = "Loan data updated successfully";
        resp.successResponse(200, res, result, message);
        return;
      }
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  updateLoanStatus: async (req, res) => {
    const { id } = req.params;
    const { loan_status } = req.body;

    validations.validateLoanStatus(loan_status, res);

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        message = `Loan with id ${id} not found`;
        resp.failedResponse(404, res, message);
        return;
      } else {
        message = "Loan data updated successfully";
        resp.successResponse(200, res, result, message);
        return;
      }
    } catch (err) {
      resp.errorResponse(500, res, err);
      return;
    }
  },
};

module.exports = admin;
