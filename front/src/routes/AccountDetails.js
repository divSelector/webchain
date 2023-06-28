import { useEffect, useState } from 'react';
import BackendSettings from '../settings/Backend';
import FrontendSettings from '../settings/Frontend';

export default function AccountDetails({ token }) {
  const back = BackendSettings();
  const front = FrontendSettings();

  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
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

        setAccount(data.account);
        setUser(data.account.user)
        setPages(data.pages)
        setWebrings(data.webrings)

      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountDetails();
  }, []);

  if (!account) {
    return <>Loading...</>;
  }

  return <>
    Account Name: {account.name}
    {console.log(user)}
    {console.log(account)}
    {console.log(pages)}
    {console.log(webrings)}
    </>; 
}
