import { useAuth } from '../../context/AuthContext';
import back from '../../settings/Backend';
import front from "../../settings/Frontend";
import React from 'react';

export default function ProductDisplay() {
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
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error('Error:', response.statusText);
      }
    } catch (error) {
        throw new Error('Error:', error);
    }
  };

  return (
    <section>
      <div className="product">
        <div className="description">
          <h2>Support Neorings</h2>
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
