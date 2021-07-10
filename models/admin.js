"use strict";

const Mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const admin_schema = new Mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = Mongoose.model("Admin", admin_schema);
module.exports = Admin;
