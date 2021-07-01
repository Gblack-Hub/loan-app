"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const ejs = require("ejs");
const loansRoute = require("./routes/loans");
const port = process.env.PORT;

//database connection
require("./config/db/db");

const {initializePayment, verifyPayment} = require('./config/paystack')(request);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));
app.set("view engine", ejs);


app.get("/", function (req, res) {
  res.render("index.ejs");
  // res.status(200).send({ message: "Loan APP" });
});

//public routes
app.use("/loans", loansRoute);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port:", port);
});
