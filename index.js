"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const loansRoute = require("./routes/loans");
const adminRoute = require("./routes/admin");
const usersRoute = require("./routes/users");
const resp = require("./utils/api-response");
const port = process.env.PORT;

const app = express();

var corsOptions = {
  origin: "http://localhost:8888",
  optionsSuccessStatus: 200,
};

//database connection
require("./config/db/db");

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let data = {
    data: null,
    message: "Loan App",
  };
  return resp.successResponse(200, res, data.data, data.message);
});

//public route
app.use("/api/loan", loansRoute);

//private route
app.use("/api/admin", adminRoute);
app.use("/api/user", usersRoute);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port:", port);
});
