"use strict";
const User = require("../models/user");
const Loan = require("../models/loan");
const axios = require("axios");
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
  return res.status(200).send(response);
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
  return;
};

let loans = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!req.body) {
        message = "All field is required";
        handle400(res, message);
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        message = `Email is already registered`;
        handle400(res, message);
        return;
      }

      let existingUsername = await User.findOne({ username });
      if (existingUsername) {
        message = `Username already taken.`;
        return handle400(res, message);
      }

      //Encrypt user password before saving to database
      let encryptedPassword = await bcrypt.hash(password, 10);

      let userData = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      if (!userData) {
        message = "Registration failed, try again";
        handle400(res, message);
        return;
      }

      // Create token
      const token = jwt.sign(
        { _id: userData._id, email },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );

      // send back user details excluding password
      const data = await User.findOne({ email }, { password: 0 });
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
      const user = await User.findOne({ email });
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
      const data = await User.findOne({ email }, { password: 0 });

      let message = "Signed In successfully";
      handleAuthResponse(data, res, message, token);
    } catch (err) {
      handleError(err, res);
    }
  },

  addLoan: async (req, res) => {
    let { amount_requested, owner, email } = req.body;
    let message;

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
    let message;
    try {
      const result = await Loan.find({}).exec();

      if (!result) {
        message = "Loans Not found";
        handle404(res, message);
        return;
      }
      if (result) {
        let message = "Successful";
        handleResultDisplay(result, res, message);
        return;
      }
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

  repayLoan: async (req, res) => {
    const { id } = req.params;
    const { reference } = req.body.response;
    if (!req.body) {
      message = "Loan repayment details not submitted";
      handle400(res, message);
      return;
    }
    try {
      const findLoan = await Loan.findById(id).exec();
      //check for possible errors before proceeding
      if (isAnyError(findLoan, res)) {
        return;
      }
      // confirm from paystack if the initiated transaction (payment) is valid
      const isPaymentValid = await checkPaymentFromPaystack(
        findLoan.amount_requested,
        reference,
        res
      );

      //update record in the database if payment is valid
      if (isPaymentValid) {
        updateRecord(id, res);
      }
      return;
    } catch (err) {
      handleError(err, res);
      return;
    }
  },
};
// function that checks possible errors before loan repayment
let isAnyError = (findLoan, res) => {
  if (!findLoan) {
    message = `Loan with id ${id} not found`;
    handle404(res, message);
    return true;
  }
  if (findLoan.loan_status !== "disbursed") {
    message = "Only disbursed loans can be repaid.";
    handle400(res, message);
    return true;
  }
  if (findLoan.isRepaid) {
    message = "Loan is already cleared.";
    handle400(res, message);
    return true;
  }
  return false;
};

//paystack verification config
let config = (reference) => {
  return {
    method: "get",
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };
};

//function that updates transaction record in database
async function updateRecord(id, res) {
  const result = await Loan.findByIdAndUpdate(
    id,
    { isRepaid: true },
    {
      useFindAndModify: false,
    }
  ).exec();

  message = "Loan repayment was successful.";
  handleResultDisplay(result, res, message);
  return;
}

//function that validates payment from paystack api
async function checkPaymentFromPaystack(amount_requested, reference, res) {
  return await axios(config(reference))
    .then((res) => {
      if (res.data && res.data.data) {
        let data = res.data.data;
        if (data.status == "success") {
          if (data.amount / 100 === amount_requested) {
            return true;
          }
          throw {
            message: "Invalid amount paid.",
          };
        }
        throw { message: "Payment Transaction was not successful" };
      }
      throw { message: "Payment Transaction was not successful" };
    })
    .catch((err) => {
      let response = {
        error: true,
        message: err.message ? err.message : "Invalid Payment Reference",
        data: null,
      };
      res.status(500).send(response);
      return;
    });
}

module.exports = loans;
