import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ServicesPage from './pages/Service'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className="relative">
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  )
}

export default App
