const jwt = require("jsonwebtoken");

const tokenUtil = {
  createToken: (signature) => {
    const token = jwt.sign({ _id: signature }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });
    return token;
  },
};
module.exports = tokenUtil;
