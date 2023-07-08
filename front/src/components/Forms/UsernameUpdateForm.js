import { useState } from 'react';
import back from '../../settings/Backend';
import LabeledInputField from '../Fields/LabeledInputField';
import { useAuth } from '../../context/AuthContext';
import { renderErrorMessage } from '../../utils/formsUtils';

export default function UsernameUpdateForm({ oldName, onUsernameUpdate }) {
  const { token } = useAuth();
  const [name, setName] = useState(oldName);
  const [nameError, setNameFieldError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const endpoint = back.getNonAuthBaseUrl() + 'user/' + oldName + '/';
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsButtonDisabled(true);
        onUsernameUpdate(name);
        setFeedbackMsg('Username successfully updated');
      } else {
        const errorMappings = [
          { key: 'name', setter: setNameFieldError },
          { key: 'non_field_errors', setter: setFeedbackMsg },
        ];

        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });
      }
    } catch (error) {
      setFeedbackMsg('Error Communicating with Server');
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <LabeledInputField
          type="text"
          id="account-name"
          name="Username"
          defaultValue={oldName}
          onChange={handleInputChange}
          error={nameError}
        />

        <button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled ? 'Updated.' : 'UPDATE'}
        </button>

        <p className="success-text">{feedbackMsg ? feedbackMsg : ''}</p>
      </form>
    </div>
  );
}
