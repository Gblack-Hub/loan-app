const Loan = require("../models/loan");

//check if loan exists
let loan_checker = async (req, res, next) => {
  try {
    const loan = await User.findById(req.params.id).exec();
    if (loan == null) {
      return res.status(404).send("loan not found");
    } else {
      res.loan = loan;
      next();
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = loan_checker;
