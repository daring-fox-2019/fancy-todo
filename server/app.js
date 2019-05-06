require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const app      = express();
const port     = process.env.PORT || 3000;
const routes   = require('./routes');
const mongoose = require('mongoose');
const DB       = process.env.DB_NAME || 'fancy-todo-1'

mongoose.connect('mongodb://localhost/' + DB , { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

morgan('tiny');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(port, () => {
    console.log('App listening on port: ' + port);
});
