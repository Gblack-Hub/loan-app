"use strict";

const Mongoose = require("mongoose");
const validator = require("validator");

const loan_schema = new Mongoose.Schema(
  {
    amount_requested: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    amount_paid: { type: Number, required: true },
    amount_remaining: { type: Number, required: true },
    next_payment_date: { type: Date, required: true },
    isRepaid: { type: Boolean, default: false, required: true },
    owner: { type: String, required: true },
    initiator: { type: String, required: true },
    loan_status: { type: String, default: "pending", required: true },
  },
  { timestamps: true }
);

const Loan = Mongoose.model("Loan", loan_schema);
module.exports = Loan;
