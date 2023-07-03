import React from 'react';

export default function LabeledInputField({ type, id, name, onChange, error, defaultValue, textarea }) {
  
  const renderInput = () => { 
    return !textarea ? (
      <input type={type} id={id} onChange={onChange} required={true} defaultValue={defaultValue} 
      />
    ) : (
      <textarea id={id} onChange={onChange} required={true} defaultValue={defaultValue} rows={8} cols={35} />
    )
  }

  const errorId = id + "-field-error";

  return (
    <div className="labeled-input">
      <label htmlFor={id}>{name}</label>
      {renderInput()}
      <p id={errorId} className="error-text">{error ? error : ""}</p>
    </div>
  );
}