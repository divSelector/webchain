import React from 'react';

export default function LabeledInputField ({ type, id, name, onChange, error }) {

  const errorId = id + "-field-error"
  
  return (
    <div className="labeled-input">
      <label htmlFor={id}>{name}</label>
      <input type={type} id={id} onChange={onChange} required={true}/>
      {error && <p id={errorId} className="error-text">{error}</p>}
    </div>
  );
};