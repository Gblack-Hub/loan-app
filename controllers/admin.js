"use strict";
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const resp = require("../utils/api-response");
const validations = require("../utils/validations");
const tokenUtil = require("../utils/tokenUtil");

let message;

let admin = {
  register: async (req, res) => {
    const { username, email, password } = req.body;

    validations.validateAdminRegistration(req, res);
    
    try {

      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        message = `Email is already registered`;
        return resp.failedResponse(409, res, message);
      }

      let existingUsername = await Admin.findOne({ username });
      if (existingUsername) {
        message = `Username already taken.`;
        resp.failedResponse(409, res, message);
        return;
      }

      //Encrypt user password before saving to database
      let encryptedPassword = await bcrypt.hash(password, 10);

      let adminData = await Admin.create({
        username,
        email,
        password: encryptedPassword,
      });

      // Create token
      const token = tokenUtil.createToken(adminData._id);

      // send back user details excluding password
      const result = await Admin.findOne({ email }, { password: 0 });

      message = "Registration successful";
      resp.authResponse(200, res, result, message, token);
    } catch (err) {
      resp.errorResponse(500, res, err);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    validations.validateAdminLogin(req);

    try {
      //check if email exists
      const user = await Admin.findOne({ email });
      if (!user) {
        message = `Email '${email}' is not registered`;
        resp.failedResponse(404, res, message);
        return;
      }
      //check if password matches the provided one
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        message = "Provided password does not match";
        resp.failedResponse(400, res, message);
        return;
      }

      // Create token if credentials are correct
      let token;
      if (user && isPasswordMatch) {
        // Create token
        token = tokenUtil.createToken(user._id);
      }

      // send back user details excluding password
      const result = await Admin.findOne({ email }, { password: 0 });

      message = "Signed In successfully";
      resp.authResponse(200, res, result, message, token);
    } catch (err) {
      resp.failedResponse(500, res, err);
    }
  },
};

module.exports = admin;
