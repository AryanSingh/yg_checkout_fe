import React from 'react'
import CheckoutForm from './components/CheckoutForm.jsx'

export default function App(){
  return (
    <div style={{maxWidth:800, margin:'40px auto', padding:20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <h1>Purnam Yoga - Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
