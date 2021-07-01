"use strict";

const Mongoose = require("mongoose");

// var nu = Math.floor(Math.random() * 10);
const loan_schema = new Mongoose.Schema(
  {
    // loan_number: { type: String, default: nu, required: true },
    amount_requested: { type: Number, required: true },
    // product: { type: Mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    loan_status: { type: String, default: "pending", required: false },
    //   date_created: { type: Date, default: Date.now(), required: true },
  },
  { timestamps: true }
);

// loan_schema.statics.checkQuantity = async (quantity) => {
//   const quantityValue = await Order.findOne({ quantity });
//   console.log(quantityValue);

//   return quantityValue;
// };

const Loan = Mongoose.model("Loan", loan_schema);
module.exports = Loan;
