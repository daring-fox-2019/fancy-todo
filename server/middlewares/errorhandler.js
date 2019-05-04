const { handler } =  require('../helpers/errorhandler');

const errorhandler = (err, req, res, next) => {
  console.trace(err)
  const error = handler(err);
  const {
    code,
    message,
  } = error;

  res.status(code).json({ message });
};

module.exports = { errorhandler };