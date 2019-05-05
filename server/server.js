const chalk = require('chalk');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const lusca = require('lusca');
const moment = require('moment');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();
const dbURL = process.env.MONGODB_URL || `mongodb://localhost:27017/${process.env.MONGODB_DOCUMENT}`;
const port = process.env.PORT || 3000;

const mainRoute = require('./routes/web');

mongoose.connect(dbURL, { useNewUrlParser: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  console.log('Please make sure MongoDB is running');
  process.exit();
});

app.disable('x-powered-by');

app.use(cors());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff(true));
app.use(lusca.referrerPolicy('origin'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if(process.env.NODE_ENV === 'development') {
  morgan.token('status', (req, res) => {
    if(res.statusCode < 400) {
      return chalk.green.bold(res.statusCode);
    } else {
      return chalk.red.bold(res.statusCode);
    };
  });

  morgan.token('date', (req, res) => { 
    return moment(req.headers['date']).format('MMMM Do YYYY, h:mm:ss a'); 
  });
  
  const logger = morgan(function (tokens, req, res) {
    return [
        chalk.whiteBright(tokens.date(req, res)),
        chalk.green.bold(tokens.method(req, res)),
        tokens.status(req, res),
        chalk.blue.bold(tokens.url(req, res)),
        chalk.yellow(`${tokens['response-time'](req, res)} ms`),
    ].join(chalk.white.bold(' - '));
  });
  
  app.use(logger);
} else {
  app.use(morgan('dev'));
};

app.use('/', mainRoute);

app.listen(port, () => {
  console.log(chalk.white(`${chalk.yellow.bold('Listening')} .... . .-.. .-.. --- - .... . .-. .
    Port: ${chalk.white.bold(port)},
    Time: ${chalk.white.bold(moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'))}`));
});
