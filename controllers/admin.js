"use strict";
const Loan = require("../models/loan");
// const jwt = require('jsonwebtoken')

let response = {
  error: null,
  message: null,
  data: null,
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
      let data = {
        error: false,
        data: result,
        message: "All loan records available",
      };
      return res.status(200).render("admin", data);
    } catch (err) {
      handleError(err, res);
    }
  },
  updateLoan: async (req, res) => {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).send({ message: "Data to update not provided" });
    }

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        res.status(404).send({ message: `Loan with id ${id} not found` });
      } else {
        let message = "Loan data updated successfully";
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
    let invalidStatus = loan_statuses.some((item) => {
      return item === loan_status;
    });

    if (!invalidStatus) {
      return res.status(400).send({ message: "Selected status is not valid" });
    }

    if (!req.body.loan_status) {
      return res.status(400).send({ message: "Select a loan status" });
    }

    try {
      let result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        res.status(404).send({ message: `Loan with id ${id} not found` });
      } else {
        let message = "Loan data updated successfully";
        handleResultDisplay(result, res, message);
      }
    } catch (err) {
      handleError(err, res);
    }
  },
};

module.exports = loans;
