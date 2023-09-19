import { useAuth } from '../../context/AuthContext';
import ProductDisplay from './ProductDisplay';
import BillingDisplay from './BillingDisplay';
import React from 'react';

export default function Payments() {
  const { authAccount } = useAuth()
  return (
    <>
      {authAccount.account_type === 'free' && <ProductDisplay />}
      {authAccount.account_type === 'subscriber' && <BillingDisplay />}
    </>
  )
}