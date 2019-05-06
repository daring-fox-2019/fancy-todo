const bcrypt = require('bcrypt')

function encrypt(str){
  let enc = bcrypt.hashSync(str, 5)
  return enc
}

function decrypt(pass, hash){
  let dec = bcrypt.compareSync(pass, hash)
  return dec
}

module.exports = {
  encrypt,
  decrypt
}