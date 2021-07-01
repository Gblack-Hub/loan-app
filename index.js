"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const loansRoute = require("./routes/loans");
const port = process.env.PORT;

//database connection
require("./db/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.status(200).send({ message: "Loan APP" });
});

//public route
app.use("/loans", loansRoute);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port:", port);
});
