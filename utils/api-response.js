
let response = {
  error: null,
  message: null,
  data: null,
};

const resp = {
  authResponse: (code, res, result, message, token) => {
    response = {
      error: false,
      message: message,
      data: result,
      authorization: token,
    };
    res.status(code).send(response);
    return;
  },

  successResponse: (code, res, result, message) => {
    response = {
      error: false,
      message: message,
      data: result,
    };
    res.status(code).send(response);
    return;
  },

  failedResponse: (code, res, message) => {
    response = {
      error: true,
      message: message,
      data: null,
    };
    res.status(code).send(response);
    return;
  },

  errorResponse: (code, res, err) => {
    response = {
      error: true,
      message: err.message,
      data: null,
    };
    return res.status(code).send(response);
  },

  incorrectRequestMethod: (methodUsed) => {
    response = {
      error: true,
      message: `Method ${methodUsed} is not allowed`,
    };
    res.status(405).send(response);
    return;
  },
};

module.exports = resp;
