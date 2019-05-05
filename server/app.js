require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${process.env.DB_URL}`, {useNewUrlParser: true});

const userRoute = require('./routes/userRoute')
const todoRoute = require('./routes/todoRoute')
const projectRoute = require('./routes/projectRoute')

app.use(express.urlencoded({extended : false}));
app.use(express.json())
app.use(cors())

app.use('/', userRoute)
app.use('/todo', todoRoute)
app.use('/projects', projectRoute)

app.listen(PORT, () => {
    console.log(`Running on localhost port: ${PORT}`);
})