import { useEffect, useState } from 'react';
import back from '../../settings/Backend';
import UsernameUpdateForm from '../Forms/UsernameUpdateForm';
import PageListView from './PageListView';
import { useAuth } from '../../context/AuthContext';
import WebringListView from './WebringListView';

export default function AccountDetails() {

  const { token } = useAuth()

  if (!token) {
    window.location.href = "/"
  }

  const [username, setUsername] = useState(null);
  const [pages, setPages] = useState([]);
  const [webrings, setWebrings] = useState([]);

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
        setWebrings(data.webrings)

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

        <WebringListView 
          ringsPassed={webrings} 
          additionalContainerStyle={{flexDirection: 'column'}}
        />
        <PageListView 
          pagesPassed={pages}
          additionalContainerStyle={{flexDirection: 'column'}}
        />
        
      </div>
    </div>; 
}
