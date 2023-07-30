import React, { useState, useEffect } from 'react';
import back from '../../settings/Backend';
import front from '../../settings/Frontend';
import { useAuth } from '../../context/AuthContext';


const ProductDisplay = () => {
  const { token } = useAuth();

  const handleCheckoutClick = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${back.host}/stripe/session`, {
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
      <form onSubmit={handleCheckoutClick}>
        <button id="checkout-and-portal-button" type="submit">
          Checkout
        </button>
      </form>
    </section>
  )
};

const SuccessDisplay = () => {
  const { token } = useAuth();

  const handlePortalClick = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${back.host}/stripe/session`, {
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
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to webchain successful!</h3>
        </div>
      </div>
      <form onSubmit={handlePortalClick}>
        <button id="checkout-and-portal-button" type="submit">
          Manage Billing
        </button>
      </form>

    </section>
  );
};

export default function Payments() {
  const { authAccount } = useAuth()
  return (
    <>
      {authAccount.account_type === 'free' && <ProductDisplay />}
      {authAccount.account_type === 'subscriber' && <SuccessDisplay />}
    </>
  )
}