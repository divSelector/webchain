import { useEffect, useState } from 'react';
import back from '../../settings/Backend';
import PageListView from './PageListView';
import { useAuth } from '../../context/AuthContext';
import WebringListView from './WebringListView';
import UsernameUpdateForm from '../Forms/UsernameUpdateForm';
import PaymentsPortal from '../Payments/PaymentsPortal';
import { Link } from 'react-router-dom';
import nicerFetch from '../../utils/requestUtils';
import React from 'react';

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
      const data = await nicerFetch({
        endpoint: endpoint,
        token: token
      });

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


  const renderPages = () => {
    if (pages.length > 0) {
      return (
        <PageListView
          pagesPassed={pages}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
          accountType={accountType}
        />
      )
    } else {
      return <h3><Link to="/page/add">Add Your First Page</Link></h3>
    }
  }

  const renderRings = () => {
    if (webrings.length > 0) {
      return (
        <WebringListView
          ringsPassed={webrings}
          additionalContainerStyle={{ flexDirection: 'column' }}
          canModifyPrimary={true}
          accountType={accountType}
        />
      )
    } else {
      return <h3><Link to="/webring/add">Add Your First Webring</Link></h3>
    }
  }

  return (
    <div className="view-wrapper">
      <div className="form-wrapper">
      <div id='account-details'>
        <h2>Account Details</h2>
        <p>{email}</p>
        {accountType == 'subscriber' && <><h5>SUBSCRIBER</h5></>}
        {accountType == 'free' && <>
          <h5>FREE</h5>
          <p>With a free account, your primary (🔘) page and webring will be 
            availabe in the chain. The ones marked unavailable (❌) will not be. 
            You can change your primary with (⭐️) button. To make sure all your 
            pages and webrings are availabe (✅), upgrade to a supporter account!</p>
        </>}
        <PaymentsPortal />
        <UsernameUpdateForm
          token={token}
          oldName={username}
          onUsernameUpdate={updateUsername}
        />
      </div>
      </div>
      <div>
        {renderRings()}
        {renderPages()}
      </div>
    </div>
  );
}
