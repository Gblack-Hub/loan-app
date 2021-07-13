const resp = require("./api-response");

const validations = {
  validateAdminRegistration: async (req, res) => {
    const { username, email, password } = req.body;
    if (!req.body) {
      message = "All field is required";
      resp.failedResponse(400, res, message);
      return;
    }
    if (!username) {
      message = "Field 'Username' is required";
      resp.failedResponse(400, res, message);
      return;
    }
    if (!email) {
      message = "Field 'Email' is required";
      resp.failedResponse(400, res, message);
      return;
    }
    if (!password) {
      message = "Field 'Password' is required";
      resp.failedResponse(400, res, message);
      return;
    }
  },

  validateAdminLogin: (req) => {
    const { email, password } = req.body;

    if (!email) {
      message = "The 'email' field is required";
      resp.failedResponse(400, res, message);
      return;
    }
    if (!password) {
      message = "The 'password' field is required";
      resp.failedResponse(400, res, message);
      return;
    }
    if (!req.body) {
      message = "All field is required";
      resp.failedResponse(400, res, message);
      return;
    }
  },

  validateAdminAddLoan: (req) => {
    let { amount_requested, email } = req.body;

    if (!email) {
      message = "An email is required";
      resp.failedResponse(400, res, message);
      return;
    }
    
    if (!amount_requested || amount_requested < 1000) {
      message = "Loan amount cannot be empty or less than N1,000";
      resp.failedResponse(400, res, message);
      return;
    }
  },

  validateLoanStatus: (loan_status, res) => {
    let loan_statuses = [
      "accepted",
      "pending",
      "reviewing",
      "rejected",
      "disbursed",
    ];

    //check if the sent loan status match any of the available loan status
    let isLoanStatusAvailable = loan_statuses.some((item) => {
      return item === loan_status;
    });

    if (!isLoanStatusAvailable) {
      message = "Selected status is not valid";
      return resp.failedResponse(400, res, message);
      return;
    }

    if (!loan_status) {
      message = "Select a loan status";
      return resp.failedResponse(400, res, message);
      return;
    }
  },
};

module.exports = validations;
