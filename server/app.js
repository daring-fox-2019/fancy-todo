require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const index = require('./routes/index')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true})

app.use('/', index)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    app.listen(process.env.PORT, () => {
        console.log(`starting port ${process.env.PORT}`);
    })
});
