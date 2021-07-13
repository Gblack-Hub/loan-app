let response = {
  error: null,
  message: null,
  data: null,
};

const resp = {
  handleAuthResponse: (result, res, message, token) => {
    response = {
      error: false,
      message: message,
      data: result,
      authorization: token,
    };

    res.status(200).send(response);
  },

  handleResultDisplay: (result, res, message) => {
    response = {
      error: false,
      message: message,
      data: result,
    };
    res.status(200).send(response);
  },

  handleSuccessResponse: (code, res, result, message) => {
    response = {
      error: false,
      message: message,
      data: result,
    };
    res.status(201).send(response);
  },

  handle400: (res, message) => {
    response = {
      error: true,
      message: message,
      data: null,
    };
    res.status(400).send(response);
  },

  handle404: (res, message) => {
    response = {
      error: true,
      message: message,
      data: null,
    };
    res.status(404).send(response);
  },

  handleError: (err, res) => {
    response = {
      error: true,
      message: err.message,
      data: null,
    };
    res.status(500).send(response);
  },
};

module.exports = resp;
