const bcrypt = require('bcrypt');

let helper = {
  generateHash: function(plainPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash
  },

  compareHash: function(plainPassword, password) {
    return bcrypt.compareSync(plainPassword, password); 
  }
}

module.exports = helper