"use strict";
const Loan = require("../models/loan");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let response = {
  error: null,
  message: null,
  data: null,
};
let message;

const handleAuthResponse = (result, res, message, token) => {
  response = {
    error: false,
    message: message,
    data: result,
    authorization: token,
  };

  res.status(200).send(response);
};
const handleResultDisplay = (result, res, message) => {
  response = {
    error: false,
    message: message,
    data: result,
  };
  res.status(200).send(response);
};
const handle400 = (res, message) => {
  response = {
    error: true,
    message: message,
    data: null,
  };
  res.status(400).send(response);
};
const handle404 = (res, message) => {
  response = {
    error: true,
    message: message,
    data: null,
  };
  res.status(404).send(response);
};
const handleError = (err, res) => {
  response = {
    error: true,
    message: err.message,
    data: null,
  };
  res.status(500).send(response);
};

let admin = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!req.body) {
        message = "All field is required";
        handle400(res, message);
      }

      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        message = `Email is already registered`;
        handle400(res, message);
        return;
      }

      let existingUsername = await Admin.findOne({ username });
      if (existingUsername) {
        message = `Username already taken.`;
        return handle400(res, message);
      }

      //Encrypt user password before saving to database
      let encryptedPassword = await bcrypt.hash(password, 10);

      let adminData = await Admin.create({
        username,
        email,
        password: encryptedPassword,
      });

      if (!adminData) {
        message = "Registration failed, try again";
        handle400(res, message);
        return;
      }

      // Create token
      const token = jwt.sign(
        { _id: adminData._id, email },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );

      // send back user details excluding password
      const data = await Admin.findOne({ email }, { password: 0 });
      message = "Registration successful";
      handleAuthResponse(data, res, message, token);
    } catch (err) {
      handleError(err, res);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!req.body) {
        message = "All field is required";
        handle400(res, message);
      }

      //check if email exists
      const user = await Admin.findOne({ email });
      if (!user) {
        message = `Email ${email} is not registered`;
        handle400(res, message);
        return;
      }
      //check if password matches the provided one
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        let message = "Provided password does not match";
        handle400(res, message);
        return;
      }

      // Create token if credentials are correct
      let token;
      if (user && isPasswordMatch) {
        token = jwt.sign({ _id: user._id, email }, process.env.JWT_KEY, {
          expiresIn: "2h",
        });
      }
      // send back user details excluding password
      const data = await Admin.findOne({ email }, { password: 0 });

      let message = "Signed In successfully";
      handleAuthResponse(data, res, message, token);
    } catch (err) {
      handleError(err, res);
    }
  },
  addLoan: async (req, res) => {
    let { amount_requested, owner, email } = req.body;
    if (!email) {
      message = "An email is required";
      handle400(res, message);
      return;
    }
    if (!amount_requested || amount_requested < 1000) {
      message = "Loan amount cannot be empty or less than N1,000";
      handle400(res, message);
      return;
    }

    try {
      let loanData = new Loan({
        amount_requested,
        owner,
        email,
      });

      const result = await loanData.save();
      if (result) {
        message = "Loan request created successfully";
        handleResultDisplay(result, res, message);
        return;
      }
    } catch (err) {
      handleError(err, res);
    }
  },
  getLoans: async (req, res) => {
    try {
      const result = await Loan.find({}).exec();
      message = "Successful";
      handleResultDisplay(result, res, message);
    } catch (err) {
      handleError(err, res);
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
        handle404(res, message);
        return;
      }
      message = "Loan data fetched successfully";
      handleResultDisplay(result, res, message);
      return;
      // } else {
      // 	response.sendStatus(403); //forbidden
      // }
    } catch (err) {
      handleError(err, res);
    }
  },
  updateLoan: async (req, res) => {
    const { id } = req.params;
    if (!req.body) {
      message = "No data provided, please provide data";
      handle400(res, message);
    }

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        message = `Loan with id ${id} not found`;
        handle404(res, message);
      } else {
        message = "Loan data updated successfully";
        handleResultDisplay(result, res, message);
      }
    } catch (err) {
      handleError(err, res);
    }
  },
  updateLoanStatus: async (req, res) => {
    const { id } = req.params;
    const { loan_status } = req.body;

    let loan_statuses = [
      "accepted",
      "pending",
      "reviewing",
      "rejected",
      "disbursed",
    ];

    //check if the sent loan status match any of the available loan status
    let isLoanStatusAvailable = loan_statuses.some((item) => {
      return item === loan_status;
    });

    if (!isLoanStatusAvailable) {
      message = "Selected status is not valid";
      handle400(res, message);
    }

    if (!loan_status) {
      message = "Select a loan status";
      handle400(res, message);
    }

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        message = `Loan with id ${id} not found`;
        handle404(res, message);
        return;
      } else {
        message = "Loan data updated successfully";
        handleResultDisplay(result, res, message);
        return;
      }
    } catch (err) {
      handleError(err, res);
    }
  },
};

module.exports = admin;
