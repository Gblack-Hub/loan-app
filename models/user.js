"use strict";

const Mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const user_schema = new Mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true, trim: true },
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

user_schema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

function handleResponse(message, res) {
  let data = {
    error: true,
    data: null,
    message: message,
  };
  return res.status(400).render("login", { data: data });
}

user_schema.statics.findByDetails = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    let message = `Email ${email} is not registered`;
    return handleResponse(message, res);
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    let message = "Provided password does not match";
    return handleResponse(message, res);
  }
  return user;
};

const User = Mongoose.model("User", user_schema);

module.exports = User;
