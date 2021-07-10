"use strict";

const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

//middlewares
const user_checker = require("../middlewares/loan_checker");
const auth_checker = require("../middlewares/auth_checker");

router.post("/register", users.register);
router.post("/login", users.login);
router.post("/loan/create", users.addLoan);
router.get("/loans", users.getLoans);
router.get("/loan/:id", users.getOneLoan);
router.put("/loan/repay/:id", users.repayLoan);

module.exports = router;
