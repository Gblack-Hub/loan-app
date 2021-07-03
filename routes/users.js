"use strict"

const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

//middlewares
const user_checker = require('../middlewares/user_checker');
const auth_checker = require('../middlewares/auth_checker');

router.route('/signup').post(username_checker, users.signUp);
router.route('/login').post(users.login);
router.route("/myloans").get(users.getLoans);

module.exports = router;