import { useEffect, useState } from 'react';
import back from '../../settings/Backend';
import PageListView from './PageListView';
import { useAuth } from '../../context/AuthContext';
import WebringListView from './WebringListView';
import UsernameUpdateForm from '../Forms/UsernameUpdateForm';
import Payments from '../Payments/Template';

export default function AccountDetails() {
  const { token } = useAuth();
  const [username, setUsername] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [email, setEmail] = useState(null);
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
      setAccountType(data.account.account_type)
      setEmail(data.account.user.email)
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

      <div id='account-details'>
        <h2>Account Details</h2>
        <p>{email}</p>
        {accountType == 'subscriber' && <h5>SUBSCRIBER</h5>}
        {accountType == 'free' && <>
          <h5>FREE</h5>
          <p>With a free account, your primary (🔘) page and webring will be availabe in the chain. The ones marked unavailable (❌) will not be. To make sure all your pages and webrings are availabe (✅), upgrade to a subscriber account!</p>
        </>}
        <Payments />
      </div>
      <div className="form-wrapper">
        <UsernameUpdateForm
          token={token}
          oldName={username}
          onUsernameUpdate={updateUsername}
        />
      </div>
      <div>
        <WebringListView
          ringsPassed={webrings}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
          accountType={accountType}
        />
        <PageListView
          pagesPassed={pages}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
          accountType={accountType}
        />
      </div>
    </div>
  );
}
