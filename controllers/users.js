"use strict";
const User = require("../models/user");
const Loan = require("../models/loan");
const axios = require("axios");

// const jwt = require('jsonwebtoken')

let response = {
  error: null,
  message: null,
  data: null,
  token: null,
};

let handleResultDisplay = (result, res, message) => {
  response = {
    error: false,
    message: message,
    data: result,
  };
  return res.status(200).send(response);
};

let handleError = (err, res) => {
  response = {
    error: true,
    message: err.message,
    data: null,
  };
  res.status(500).send(response);
  return;
};

let loans = {
  signUp: async (req, res) => {
    function handleResponse(message, res) {
      let data = {
        error: true,
        data: null,
        message: message,
      };
      return res.status(400).render("signup", { data: data });
    }
    try {
      let { user_name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        let message = `Email is already registered`;
        return handleResponse(message, res);
      }

      let checkRecord = await User.findOne({ user_name });
      if (checkRecord) {
        let message = `Username already taken.`;
        return handleResponse(message, res);
      }
      let userData = new User({
        user_name: user_name,
        email: email,
        password: password,
      });
      const result = await userData.save();
      let message = "You have successfully signed up, login to continue";
      // let data = { error: false, data: result, message: message };
      res.redirect("/");
    } catch (err) {
      res.render("signup", { data: "Sign Up error" });
    }
  },

  getSignUpPage: (req, res) => {
    try {
      let data = {
        error: false,
        data: null,
        message: "success",
      };
      res.render("signup", { data: data });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getLoginPage: (req, res) => {
    try {
      let data = {
        error: false,
        data: null,
        message: "success",
      };
      res.render("login", { data: data });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  login: async (req, res) => {
    try {
      let { user_name, password } = req.body;
      // let pass = await bcrypt.hash(password, 8);
      // const result = await User.find({
      //   user_name: user_name,
      //   password: pass,
      // });
      // console.log(result);
      const user = await User.findByDetails(email, password);
      if (!user) {
        res
          .status(401)
          .send({ error: "Failed to login, please check your login details" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });

      // if (result.length > 0) {
      //   let data = {
      //     error: true,
      //     data: null,
      //     message: "Login failed, check your login details",
      //   };
      //   return res.status(401).render("login", { data: data });
      // }
      // const token = jwt.sign({ _id: result._id }, jwtkey);
      let message = "Login successful";
      res.redirect("/");
    } catch (err) {
      res.status(500).send(err);
    }
  },

  addLoan: async (req, res) => {
    if (!req.body.amount_requested || req.body.amount_requested < 1000) {
      let data = {
        error: true,
        data: null,
        message: "Loan amount cannot be empty or less than N1,000",
      };
      return res.status(401).render("index", { data: data });
    }

    try {
      let { amount_requested, email, owner } = req.body;
      let loanData = new Loan({
        amount_requested,
        email,
        owner,
      });

      const result = await loanData.save();
      let data = {
        error: false,
        data: result,
        message: "Loan request created successfully",
      };
      return res.status(200).render("index", { data: data });
    } catch (err) {
      handleError(err, res);
    }
  },

  getLoans: async (req, res) => {
    try {
      const result = await Loan.find({}).exec();
      let message = "All loan records available";
      let data = {
        error: false,
        data: result,
        message: "All loan records available",
      };
      return res.status(200).render("loans", data);
    } catch (err) {
      handleError(err, res);
    }
  },

  repayLoan: async (req, res) => {
    const { id } = req.params;
    const { reference } = req.body.response;
    try {
      const findLoan = await Loan.findById(id).exec();
      if (isAnyError(findLoan, res)) {
        return;
      }
      const isPaymentValid = await checkPaymentFromPaystack(
        findLoan.amount_requested,
        reference,
        res
      );
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

let isAnyError = (findLoan, res) => {
  if (!findLoan) {
    let data = {
      error: true,
      data: null,
      message: `Loan with id ${id} not found`,
    };
    res.status(404).send(data);
    return true;
  }
  if (findLoan.loan_status !== "disbursed") {
    let data = {
      error: true,
      data: null,
      message: "Only disbursed loans can be repaid.",
    };
    res.status(200).send(data);
    return true;
  }
  if (findLoan.isRepaid) {
    let data = {
      error: true,
      data: null,
      message: "Loan is already cleared.",
    };
    res.status(400).send(data);
    return true;
  }
  return false;
};

let config = (reference) => {
  return {
    method: "get",
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };
};

async function updateRecord(id, res) {
  const result = await Loan.findByIdAndUpdate(
    id,
    { isRepaid: true },
    {
      useFindAndModify: false,
    }
  ).exec();

  let message = "Loan repayment was successful.";
  handleResultDisplay(result, res, message);
  return;
}

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
