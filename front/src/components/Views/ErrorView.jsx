import React from 'react';

const ErrorView = ({error}) => {

  let message = "Not Found"
  let detail = ""
  if (error) {
    message = error.message.split(';')[0]
    detail = error.message.split(';')[1]
  }

  return (
    <div className='view-wrapper'>
      <div>
        <h1>{message && message}</h1>
        <p>{detail && detail}</p>
      </div>
      
    </div>
  );
};

export default ErrorView;