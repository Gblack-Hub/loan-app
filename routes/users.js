"use strict";

const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

//middlewares
const user_checker = require("../middlewares/user_checker");
const auth_checker = require("../middlewares/auth_checker");

router.get("/signup", users.getSignUpPage);
router.post("/signup", users.signUp);
router.get("/login", users.getLoginPage);
router.post("/login", users.login);
router.post("/create-loan", users.addLoan);
router.get("/loans", users.getLoans);
router.put("/repay/:id", users.repayLoan);

module.exports = router;
