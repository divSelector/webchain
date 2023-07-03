import { useEffect, useState } from 'react';
import BackendSettings from '../settings/Backend';
import UsernameUpdateForm from '../components/Forms/UsernameUpdateForm';
import { Link } from 'react-router-dom';
import PageListView from './PageListView';

export default function AccountDetails({ token }) {

  if (!token) {
    window.location.href = "/"
  }

  const back = BackendSettings();

  const [username, setUsername] = useState(null);
  const [pages, setPages] = useState([]);

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
        setPages(data.pages)
        console.log(pages)

      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountDetails();
  }, [username]);

  if (!username) {
    return <></>;
  }

  return <div className="view-wrapper">
      <div>
        <h2>Account Details</h2>
        <UsernameUpdateForm 
          token={token} 
          oldName={username}
          onUsernameUpdate={(updatedName) => setUsername(updatedName)}
        />

        <PageListView pagesPassed={pages} />
        
      </div>
    </div>; 
}
