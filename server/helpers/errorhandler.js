const nodeError = ['Error','EvalError','InternalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError'];
const mongooseClientError = ['CastError','ValidatorError','ValidationError'];

const errorCode = (errorMessage) => {
  switch(errorMessage) {
    case 'Wrong email/password':
      return 400;
      
    case 'We can\'t verify your request':
      return 400;
      
    case 'User not found':
      return 404;

    case 'Unauthorized':
      return 401;

    case 'Todo not found':
      return 404;

    case 'Project not found':
      return 404;

    default:
      return 500;
  };
};

const handler = (error) => {
  const errorObj = { ...error };

  if (nodeError.includes(error.name)) {
    const {
      message, arguments,
      type, name,
    } = error;

    errorObj.error =  {
      message, arguments,
      type, name,
    };

    errorObj.source = 'Custom';
    errorObj.message = error.message;
    code = errorCode(error.message);
  } else if(mongooseClientError.includes(error.name)) {
      errorObj.source = 'Database';
      errorObj.message = error.message ?  error.message : 'We can\'t process your request';
      code = 400;
  } else {
      errorObj.source = 'System';
      errorObj.message = 'There\'s something wrong in the system';
      code = 500;
  };
    errorObj.code = code;
    return errorObj;
};

module.exports = { handler };
