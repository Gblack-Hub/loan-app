"use strict";

const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");

router.post("/register", admin.register);
router.post("/login", admin.login);
router.post("/loan/create", admin.addLoan);
router.get("/loans", admin.getLoans);
router.get("/loan/:id", admin.getOneLoan);
router.put("/loan/update/:id", admin.updateLoanStatus);

module.exports = router;
