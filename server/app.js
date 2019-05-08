require('dotenv').config();
const express = require('express');
const app = express();

const router = require('./routes')
const mongoose = require('mongoose');
mongoose.connect(process.env.ATLAS_URL || 'mongodb://localhost:27017/fancy-todo-1', {useNewUrlParser: true})

const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/', router)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})