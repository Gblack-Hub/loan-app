const resp = require("./api-response");

const validations = {
  validateAdminRegistration: (req, res) => {
    const { username, email, password } = req.body;
    if (!req.body) {
      message = "All field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!username) {
      message = "Field 'Username' is required";
      return resp.failedResponse(400, res, message);
    }
    if (!email) {
      message = "Field 'Email' is required";
      return resp.failedResponse(400, res, message);
    }
    if (!password) {
      message = "Field 'Password' is required";
      return resp.failedResponse(400, res, message);
    }
  },

  validateAdminLogin: (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      message = "The 'email' field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!password) {
      message = "The 'password' field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!req.body) {
      message = "All field is required";
      return resp.failedResponse(400, res, message);
    }
  },

  validateAddLoan: (req, res) => {
    let { amount_requested } = req.body;

    if (!amount_requested || amount_requested < 1000) {
      message = "Loan amount cannot be empty or less than N1,000";
      return resp.failedResponse(400, res, message);
    }
  },

  validateUserRegistration: (req, res) => {
    const { username, email, password } = req.body;
    if (!req.body) {
      message = "All field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!username) {
      message = "Field 'Username' is required";
      return resp.failedResponse(400, res, message);
    }
    if (!email) {
      message = "Field 'Email' is required";
      return resp.failedResponse(400, res, message);
    }
    if (!password) {
      message = "Field 'Password' is required";
      return resp.failedResponse(400, res, message);
    }
  },

  validateUserLogin: (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      message = "The 'email' field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!password) {
      message = "The 'password' field is required";
      return resp.failedResponse(400, res, message);
    }
    if (!req.body) {
      message = "All field are required";
      return resp.failedResponse(400, res, message);
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
    }

    if (!loan_status) {
      message = "Select a loan status";
      return resp.failedResponse(400, res, message);
    }
  },

  validateLoanRepayment: (req, res) => {
    const { id } = req.params;
    const { reference } = req.body.response;

    if (!req.body) {
      message = "Loan repayment details not submitted";
      return resp.failedResponse(400, res, message);
    }
  },

  validateLoanRequirements: (findLoan, res) => {
    if (!findLoan) {
      message = `Loan with id ${id} not found`;
      return resp.failedResponse(404, res, message);
    }
    if (findLoan.loan_status !== "disbursed") {
      message = "Only disbursed loans can be repaid.";
      return resp.failedResponse(404, res, message);
    }
    if (findLoan.isRepaid) {
      message = "Loan is already cleared.";
      return resp.failedResponse(404, res, message);
    }
  },
};

module.exports = validations;
