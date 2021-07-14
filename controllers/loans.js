"use strict";
const Loan = require("../models/loan");
const resp = require("../utils/api-response");
const validations = require("../utils/validations");

let message;

let loans = {
  addLoan: async (req, res) => {
    let { amount_requested, owner, email } = req.body;

    validations.validateAddLoan(req, res);

    try {
      let loanData = new Loan({
        amount_requested,
        owner,
        email,
      });

      const result = await loanData.save();

      message = "Loan request created successfully";
      resp.successResponse(200, res, result, message);
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  getLoans: async (req, res) => {
    try {
      const result = await Loan.find({}).exec();

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
      resp.successResponse(200, res, result, message);
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

module.exports = loans;
