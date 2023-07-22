import React, { useState, useEffect } from 'react';

export default function ModalDialogue ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const [confirm, setConfirm] = useState(!confirmText ? "Confirm" : confirmText)
  const [cancel, setCancel] = useState(!cancelText ? "Cancel" : cancelText)

  const handleConfirm = () => {
    onConfirm();
    setIsVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };


  const handleDismiss = () => {
    setIsVisible(false);
  };


  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          {onConfirm && <button onClick={handleConfirm}>{confirm}</button>}
          {onCancel && <button onClick={handleCancel}>{cancel}</button>}
        </div>
      </div>
    </div>
  );
};