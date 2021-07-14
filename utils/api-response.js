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
    return res.status(code).send(response);
  },

  successResponse: (code, res, result, message) => {
    response = {
      error: false,
      message: message,
      data: result,
    };
    return res.status(code).send(response);
  },

  failedResponse: (code, res, message) => {
    response = {
      error: true,
      message: message,
      data: null,
    };
    return res.status(code).send(response);
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
    return res.status(405).send(response);
  },
};

module.exports = resp;
