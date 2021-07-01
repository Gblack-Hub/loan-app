"use strict";
const Loan = require("../models/loan");
// const jwt = require('jsonwebtoken')

const init_response = {
  error: null,
  message: null,
  data: null,
};

let loans = {
  addLoan: async (req, res) => {
    if (!req.body.amount_requested || req.body.amount_requested < 1000) {
      res
        .status(400)
        .send({ message: "Loan amount cannot be empty or less than N1,000" });
      return;
    }
    let response = init_response;
    try {
      let { amount_requested } = req.body;
      let loanData = new Loan({
        amount_requested: amount_requested,
      });

      const result = await loanData.save();

      response = {
        error: false,
        message: "success",
        data: result,
      };
      res.status(200).send(response);
    } catch (err) {
      response = {
        error: true,
        message: err.message,
        data: null,
      };
      res.status(500).send(response);
    }
  },

  getLoans: async (req, res) => {
    let response = init_response;
    try {
      // const result = await Order.find().select('order_number product').populate('product').exec()
      const result = await Loan.find().select("loan_number product").exec();
      response = {
        error: false,
        message: "success",
        data: res.status(200).send(result),
      };
      res.send(result);
    } catch (err) {
      response.error = true;
      res.status(500).send(err);
    }
  },
  getOneLoan: async (req, res) => {
    // let response = init_response;
    // try {
    // 	if(typeof req.header('Authorization') !== undefined){  //check if bearer is undefined
    // 		const token = req.header('Authorization').replace('Bearer ', '')
    // 		const user = jwt.verify(token, process.env.JWT_KEY)
    // 		const result = await User.findById(user._id).exec()
    // 		response = {
    // 			error: false,
    // 			message: 'success',
    // 			data: res.status(200).send(result)
    // 		}
    // 	} else {
    // 		response.sendStatus(403); //forbidden
    // 	}
    // } catch(err) {
    // 	response.error = true;
    // 	res.status(500).send(err);
    // }
    res.send("read one order works");
  },
  updateLoan: async (req, res) => {
    // let response = init_response;
    // try {
    // 	const result = await User.findById(req.params.id).exec();
    // 	response = {
    // 		error: false,
    // 		data: res.status(200).send(result),
    // 	}
    // } catch(err) {
    // 	response.error = true;
    // 	res.status(500).send(err);
    // }
    res.send("update order works");
  },
  deleteLoan: async (req, res) => {
    // let response = init_response;
    // try {
    // 	let { user_id } = req.params;
    // 	// const result = await User.findById(req.params.id).exec();
    // 	await Users.deleteOne({ _id: ObjectId(user_id) })
    // 	// res.redirect('/?m=deleted')
    // 	response = {
    // 		error: false,
    // 		data: res.status(200).send('deleted')
    // 	}
    // } catch(err) {
    // 	response.error = true;
    // 	res.status(500).send(err);
    // }
    res.send("delete order works");
  },
};

module.exports = loans;
