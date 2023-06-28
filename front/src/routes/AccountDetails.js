import { useEffect, useState } from 'react';
import BackendSettings from '../settings/Backend';
import UsernameUpdateForm from '../components/Forms/UsernameUpdateForm';

export default function AccountDetails({ token }) {
  const back = BackendSettings();


  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const endpoint = back.getNonAuthBaseUrl() + 'user/';
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account details');
        }

        const data = await response.json();
        console.log(data)

        setUsername(data.account.name)

      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountDetails();
  }, [username]);

  if (!username) {
    return <>Loading...</>;
  }

  return <>
    <UsernameUpdateForm 
      token={token} 
      oldName={username}
      onUsernameUpdate={(updatedName) => setUsername(updatedName)}
    />

    </>; 
}
