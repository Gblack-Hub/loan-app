"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const loansRoute = require("./routes/loans");
const adminRoute = require("./routes/admin");
const usersRoute = require("./routes/users");
const port = process.env.PORT;

const app = express();

//database connection
require("./config/db/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let data = {
    error: null,
    data: null,
    message: "Loan App",
  };
  return res.status(200).send(data);
});

//public route
app.use("/loan", loansRoute);

//private route
app.use("/admin", adminRoute);
app.use("/user", usersRoute);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port:", port);
});
