require ('dotenv').config()

const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const cors = require('cors')

let uri = process.env.MONGO_ATLAS
mongoose.connect(uri, {useNewUrlParser : true, useCreateIndex : true})
.then(() => console.log('=====> Mongo Connected <====='))
.catch(err => console.log(err))

app
    .use(express.json())
    .use(express.urlencoded({urlencoded : true}))
    .use(cors())

app.use('/', routes)

app.listen(port, () => console.log(`listening on ${port}`))
