import back from "../../settings/Backend";
import front from "../../settings/Frontend";
import { useAuth } from "../../context/AuthContext";
import React from 'react';

export default function BillingDisplay() {
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
          const data = await response.json();
          window.location.href = data.url;
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    return (
      <section>
        <div className="product">
        </div>
        <form onSubmit={handlePortalClick}>
          <button id="checkout-and-portal-button" type="submit">
            Manage Billing
          </button>
        </form>
  
      </section>
    );
  };