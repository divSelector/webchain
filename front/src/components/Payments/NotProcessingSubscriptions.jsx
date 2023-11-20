import { useAuth } from '../../context/AuthContext';
import back from '../../settings/Backend';
import front from "../../settings/Frontend";
import React from 'react';

export default function NotProcessingSubscriptions() {
  const { token } = useAuth();

  return (
    <section>
      <div className="product">
        <div className="description">
          <h2>This app is in beta.</h2>
          <h5>We are not currently processing subscriptions.</h5>
          <p></p>
        </div>
      </div>
    </section>
  )
};
