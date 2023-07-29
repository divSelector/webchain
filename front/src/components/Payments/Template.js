import React, { useState, useEffect } from 'react';
import back from '../../settings/Backend';
import front from '../../settings/Frontend';
import { useAuth } from '../../context/AuthContext';


const ProductDisplay = () => {
  const { token } = useAuth();
  const handleCheckout = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${back.host}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ lookup_key: front.stripePriceLookupKey }),
      });

      if (response.ok) {
        // Success: redirect to checkout session URL
        const data = await response.json();
        window.location.href = data.url;
      } else {
        // Handle error
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section>
      <div className="product">
        <div className="description">
          <h2>Subscribe</h2>
          <h5>$5.00 / month</h5>
          <p></p>
        </div>
      </div>
      <form onSubmit={handleCheckout}>
        {/* <input type="hidden" name="lookup_key" value={front.stripePriceLookupKey} /> */}
        <button id="checkout-and-portal-button" type="submit">
          Checkout
        </button>
      </form>
    </section>
  )
};

const SuccessDisplay = ({ sessionId }) => {
  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to webchain successful!</h3>
        </div>
      </div>
      <form action={back.host+"/stripe/create-portal-session"} method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Payments({ setAccountType }) {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState('');

  const { token, authAccount } = useAuth()

  const setAccountTypeSubscriber = async () => {
    const endpoint = back.getNonAuthBaseUrl() + 'user/' + authAccount.name + '/';
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          account_type: 'subscriber',
        }),
      });
      const data = await response.json();
      setAccountType('subscriber')
    } catch (error) {
      throw error
    }
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
      setAccountTypeSubscriber()
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}