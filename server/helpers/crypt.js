const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: function(plainPassword) {
    return bcrypt.hashSync(plainPassword, 8);
  },
  comparePassword: function(plainPassword, hash) {
    let status = bcrypt.compareSync(plainPassword, hash);
    return status;
  }
}
