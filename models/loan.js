"use strict";

const Mongoose = require("mongoose");

const loan_schema = new Mongoose.Schema(
  {
    amount_requested: { type: Number, required: true },
    owner: { type: String, required: true },
    loan_status: { type: String, default: "pending", required: true },
  },
  { timestamps: true }
);

const Loan = Mongoose.model("Loan", loan_schema);
module.exports = Loan;
