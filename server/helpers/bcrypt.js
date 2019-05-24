const bcrypt = require('bcryptjs');

module.exports = {
    compare(input, hashed) {
        let compared = bcrypt.compareSync(input, hashed)
        return compared;
    },
    hash(input) {
        let hashed = bcrypt.hashSync(input, 10)
        return hashed;
    }
}