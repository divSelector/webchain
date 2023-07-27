import { useEffect, useState } from 'react';
import back from '../../settings/Backend';
import PageListView from './PageListView';
import { useAuth } from '../../context/AuthContext';
import WebringListView from './WebringListView';
import UsernameUpdateForm from '../Forms/UsernameUpdateForm';

export default function AccountDetails() {
  const { token } = useAuth();
  const [username, setUsername] = useState(null);
  const [pages, setPages] = useState([]);
  const [webrings, setWebrings] = useState([]);

  const updateUsername = (updatedName) => {
    setUsername(updatedName);
  };

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
      setUsername(data.account.name);
      setPages(data.pages);
      setWebrings(data.webrings);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [token]);

  if (!username) {
    return <></>;
  }

  return (
    <div className="view-wrapper">

      <h2>Account Details</h2>
      <UsernameUpdateForm
        token={token}
        oldName={username}
        onUsernameUpdate={updateUsername}
      />
      <div>
        <WebringListView
          ringsPassed={webrings}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
        />
        <PageListView
          pagesPassed={pages}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
        />
      </div>
    </div>
  );
}
