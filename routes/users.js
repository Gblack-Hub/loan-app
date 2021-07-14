"use strict";

const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

//middlewares
const auth_user_checker = require("../middlewares/auth_user_checker");

router.post("/register", users.register);
router.post("/login", users.login);
router.post("/loan/create", auth_user_checker, users.addLoan);
router.get("/loans", auth_user_checker, users.getLoans);
router.get("/loan/:id", auth_user_checker, users.getOneLoan);
router.put("/loan/repay/:id", auth_user_checker, users.repayLoan);

module.exports = router;
