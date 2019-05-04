require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const port = 3000
const routes = require('./routes')
const cors = require('cors')

let app = express()

app.use(cors())

app.use(express.urlencoded({extended:false}))
app.use(express.json())

mongoose.connect(process.env.DB, {useNewUrlParser:true})

app.use('/', routes)

app.listen(port, ()=>{
    console.log(`Listen on ${port}`);
})