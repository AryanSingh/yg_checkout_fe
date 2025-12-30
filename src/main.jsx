import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/payment-success' element={<Success />} />
      <Route path='/payment-failed' element={<Failure />} />
    </Routes>
  </BrowserRouter>
)
