const axios = require("axios");

//paystack verification config
let config = (reference) => {
  return {
    method: "get",
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };
};

const paystack = {
  checkPaymentFromPaystack: async (amount_requested, reference, res) => {
    return await axios(config(reference))
      .then((res) => {
        if (res.data && res.data.data) {
          let data = res.data.data;
          if (data.status == "success") {
            if (data.amount / 100 <= amount_requested) {
              return true;
            }
            throw {
              message: "Invalid payment amount.",
            };
          }
          throw { message: "Payment Transaction was not successful" };
        }
        throw { message: "Payment Transaction was not successful" };
      })
      .catch((err) => {
        let response = {
          error: true,
          message: err.message ? err.message : "Invalid Payment Reference",
          data: null,
        };
        res.status(500).send(response);
        return;
      });
  },
};

module.exports = paystack;
