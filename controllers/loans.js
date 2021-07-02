"use strict";
const Loan = require("../models/loan");
// const jwt = require('jsonwebtoken')

const init_response = {
  error: null,
  message: null,
  data: null,
};

let handleResultDisplay = (result) => {
  init_response = {
    error: false,
    message: "success",
    data: result,
  };
  res.status(200).send(response);
};
let handleError = (result) => {
  init_response = {
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
      let { amount_requested } = req.body;
      let loanData = new Loan({
        amount_requested: amount_requested,
      });

      const result = await loanData.save();

      handleResultDisplay(result);
    } catch (err) {
      handleError(err);
    }
  },
  getLoans: async (req, res) => {
    try {
      // const result = await Loan.find({}).select("loan_number product").exec();
      const result = await Loan.find({});
      handleResultDisplay(result);
    } catch (err) {
      handleError(err);
    }
  },
  getOneLoan: async (req, res) => {
    // const { id } = req.params;
    // try {
    // 	if(typeof req.header('Authorization') !== undefined){  //check if bearer is undefined
    // 		const token = req.header('Authorization').replace('Bearer ', '')
    // 		const user = jwt.verify(token, process.env.JWT_KEY)
    // 		const result = await Loan.findById(id).exec()
    // 		handleSuccess(result);
    // 	} else {
    // 		response.sendStatus(403); //forbidden
    // 	}
    // } catch(err) {
    // 	handleError(err);
    // }
  },
  updateLoan: async (req, res) => {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).send({ message: "Data to update not provided" });
    }

    try {
      const result = await Loan.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false,
      }).exec();
      if (!result) {
        res.status(404).send({ message: `Loan with id ${id} not found` });
      } else {
        result = "updated successfully";
        handleResultDisplay(result);
      }
    } catch (err) {
      handleError(err);
    }
  },
  deleteLoan: async (req, res) => {
    try {
      let { id } = req.params;
      let result = await User.findById(id).exec();
      await Users.deleteOne({ _id: ObjectId(id) });
      // res.redirect('/?m=deleted')
      result = "deleted";
      handleResultDisplay(result);
    } catch (err) {
      handleError(err);
    }
  },
};

module.exports = loans;
