const router = require('./routes/index')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const url = `mongodb://localhost/fancy-todo`
const app = express()
const port = 3000


mongoose.connect(url, {
    useNewUrlParser: true
})
.then(() => {
    console.log('======> MongoDB Connected <=======');
})
.catch((err) => {
    console.log(err)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/', router)

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})