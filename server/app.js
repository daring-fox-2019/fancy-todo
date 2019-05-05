require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const cors = require("cors")
const {Authentication} = require("./middlewares/authentication")
mongoose.connect("mongodb://localhost/fancy-todo", {useNewUrlParser: true, useCreateIndex: true})
// mongoose.set('useCreateIndex', true)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'CONNECTION ERROR!'))
db.once('open', function(){
    console.log("mongoose is connected!")
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/user', require("./routes/userRoute"))
app.use('/login', require('./routes/oauth'))
app.use('/weather', require('./routes/weatherRoute'))
app.use(Authentication)
app.use('/todo', require('./routes/todoRoute'))


app.listen(port, ()=>{
console.log(`server is running at port 3000`)
})