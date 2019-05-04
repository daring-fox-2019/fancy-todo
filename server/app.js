
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT
const routes = require('./routes')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fancy_todo', {useNewUrlParser: true});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})