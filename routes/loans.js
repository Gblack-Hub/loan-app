"use strict";

const express = require("express");
const router = express.Router();
const loans = require("../controllers/loans");

router.route("/create").post(loans.addLoan);
router.route("").get(loans.getLoans);
// // router.route('/:id').get(product_checker, orders.readOneProduct);
// router.route('/update/:id').put(orders.updateProduct);
// router.route('/delete/:id').delete(orders.deleteProduct);

module.exports = router;
