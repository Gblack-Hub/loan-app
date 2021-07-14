"use strict";
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const resp = require("../utils/api-response.js");

let message;

const auth_admin_checker = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      message = "No authorization key provided";
      return resp.failedResponse(403, res, message);
    }
    //check if bearer is not undefined
    if (typeof req.header("Authorization") !== undefined) {
      const token = req.header("Authorization").replace("Bearer ", "");
      const user = jwt.verify(token, process.env.JWT_KEY);

      if (!user) {
        message = "You are not authorized to access this page";
        return resp.failedResponse(401, res, message);
      }

      const result = await Admin.findById(
        { _id: user._id },
        { password: 0 }
      ).exec();

      if (result) {
        req.user = result;
        req.token = token;
        next();
      }
    } else {
      message = "You cannot access this page";
      return resp.failedResponse(403, res, result, message);
    }
  } catch (err) {
    return resp.errorResponse(500, res, err);
  }
};

module.exports = auth_admin_checker;
