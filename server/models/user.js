const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

let user = new Schema({
    userName : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password : {
       type: String,
       required: true
    }
})

user.pre('save', function(next){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(this.password, salt);
    this.password = hash
    // console.log(this.password)
    next()
})

// user.pre('findOne', function(next){
//     let salt = bcrypt.genSaltSync(10);
//     let hash = bcrypt.hashSync(this.password, salt);
//     bcrypt.compare(this.password, hash)
//     .then(res => {
//         if(res){
//             next()
//         }else{
//             console.log("Error compare password ===> ",err)
//         }
//     })
//     .catch(err => {
//         console.log("Error compare password ===> ",err)
//     })
// })

let User = mongoose.model('User', user)

module.exports = User