"use strict";
const User = require("../models/user");
const Loan = require("../models/loan");
// const jwt = require('jsonwebtoken')

let response = {
  error: null,
  message: null,
  data: null,
  token: null
};

let handleResultDisplay = (result, res, message) => {
  response = {
    error: false,
    message: message,
    data: result,
  };
  res.status(200).send(response);
};
let handleError = (err, res) => {
  response = {
    error: true,
    message: err.message,
    data: null,
  };
  res.status(500).send(response);
};

let loans = {
  signUp: async (req, res) => {
    try {
      let { user_name, password } = req.body;
      let userData = new User ({
        user_name: user_name,
        password: password,
      });
      const result = await userData.save();
      let message = "You have successfully signed up";
      handleResultDisplay(result, res, message);
    } catch(err) {
      handleError(err, res);
    }
  },

  login: async (req, res) => {
    try {
      let { user_name, password } = req.body;
      const result = await User.findByDetails(user_name, password)
      if(!result){
        res.status(401).send({ error: "Login failed, check your login details" });
      }
      const token = jwt.sign({ _id: result._id }, jwtkey);
      let message = "Login successful";
      handleResultDisplay(result, res, message);
    } catch(err) {
      res.status(500).send(err);
    }
  },

  addLoan: async (req, res) => {
    if (!req.body.amount_requested || req.body.amount_requested < 1000) {
      res.status(400).send({
        message: "Loan amount cannot be empty or less than &#8358;1,000",
      });
      return;
    }

    try {
      let { amount_requested, owner } = req.body;
      let loanData = new Loan({
        amount_requested,
        owner,
      });

      const result = await loanData.save();
      let message = "Loan request created successfully";
      handleResultDisplay(result, res, message);
    } catch (err) {
      handleError(err, res);
    }
  },
  
  getLoans: async (req, res) => {
    try {
      const result = await Loan.find({}).exec();
      let message = "All loan records available";
      handleResultDisplay(result, res, message);
    } catch (err) {
      handleError(err, res);
    }
  },
};

module.exports = loans;
