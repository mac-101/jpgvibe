import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ServicesPage from './pages/Service'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TeamPage from './pages/Team'
import InstagramProvider from "./instagram/InstagramProvider";
import InstagramPage from "./instagram/InstagramPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/instagram" element={<InstagramPage />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className="relative">
        <InstagramProvider>

          <Navbar />
          <AppRoutes />
          <Footer />
        </InstagramProvider>
      </div>
    </Router>
  )
}

export default App
