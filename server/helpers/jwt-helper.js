const jwt = require("jsonwebtoken");

module.exports = {
  verify: function(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  sign: function(userData) {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1d" });
  } 
}