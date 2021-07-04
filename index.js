"use strict";

require("dotenv").config();

const express = require("express");
// const axios = require("axios");
const path = require("path");
const loansRoute = require("./routes/loans");
const adminRoute = require("./routes/admin");
const usersRoute = require("./routes/users");
const auth_checker = require("./middlewares/auth_checker");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const port = process.env.PORT;

const app = express();

//database connection
require("./config/db/db");

// const { initializePayment, verifyPayment } =
//   require("./config/paystack")(axios);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));
app.set("view engine", "ejs");

// app.use(function (req, res, next) {
//   if (req.session.user == null) {
//     res.redirect("/user/signup");
//   } else {
//     next();
//   }
// });

app.get("/", function (req, res) {
  let data = {
    error: null,
    data: null,
    message: "success",
  };
  return res.status(200).render("index", { data: data });
});

// app.get("/admin", function (req, res) {
//   let data = [
//     { id: "jksjk6wsd77as6dfa", amount_requested: 20000, owner: "Abiodun", status: "pending" },
//     { id: "jksjk6wsd77as6dfa", amount_requested: 10000, owner: "Abbey", status: "accepted" },
//     { id: "jksjk6wsd77as6dfa", amount_requested: 10000, owner: "Olu", status: "reviewing" },
//     { id: "jksjk6wsd77as6dfa", amount_requested: 10000, owner: "Ade", status: "rejected" },
//     { id: "jksjk6wsd77as6dfa", amount_requested: 10000, owner: "Ifeoluwa", status: "disbursed" },
//   ]
//   res.render("loans.ejs", {data: data});
// });

// app.put("/admin/loan/update/:id", function (req, res) {
//   res.send(req.params);
// });

// paystack.customer
//   .list()
//   .then(function (body) {
//     console.log(body);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// app.post("/paystack/pay", (req, res) => {
//   const form = _.pick(req.body, ["amount", "email", "full_name"]);
//   form.metadata = {
//     full_name: form.full_name,
//   };
//   form.amount *= 100;
//   initializePayment(form, (error, body) => {
//     if (error) {
//       //handle errors
//       console.log(error);
//       return;
//     }
//     response = JSON.parse(body);
//     res.redirect(response.data.authorization_url);
//   });
// });

// app.get("/paystack/callback", (req, res) => {
//   const ref = req.query.reference;
//   verifyPayment(ref, (error, body) => {
//     if (error) {
//       //handle errors appropriately
//       console.log(error);
//       return res.redirect("/error");
//     }
//     response = JSON.parse(body);
//     const data = _.at(response.data, [
//       "reference",
//       "amount",
//       "customer.email",
//       "metadata.full_name",
//     ]);
//     [reference, amount, email, full_name] = data;
//     newDonor = { reference, amount, email, full_name };
//     const donor = new Donor(newDonor);
//     donor
//       .save()
//       .then((donor) => {
//         if (donor) {
//           res.redirect("/receipt/" + donor._id);
//         }
//       })
//       .catch((e) => {
//         res.redirect("/error");
//       });
//   });
// });

//public route
app.use("/loan", loansRoute);

//private route
app.use("/admin", adminRoute);
app.use("/user", usersRoute);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port:", port);
});
