import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ServicesPage from './pages/Service'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TeamPage from './pages/Team'
import InstagramProvider from "./instagram/InstagramProvider";
import InstagramPage from "./instagram/InstagramPage";
import AboutPage from "./pages/About";
import ContactPage from './pages/Contact'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/art-feed" element={<InstagramPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage/>} />
    </Routes>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <Router>
      <div className="relative">
        <ScrollToTop />
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
