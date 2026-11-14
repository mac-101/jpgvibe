import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ServicesPage from './pages/Service'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TeamPage from './pages/Team'
import InstagramProvider from "./instagram/InstagramProvider";
import InstagramPage from "./instagram/InstagramPage";
import AboutPage from "./pages/About";
import ContactPage from './pages/Contact'
import NotFound from './pages/NotFound'
import WaitlistPage from './pages/Waitlist'
import RouteSeo from './RouteSeo'
import { ROUTES } from './routes'

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.services} element={<ServicesPage />} />
      <Route path={ROUTES.team} element={<TeamPage />} />
      <Route path={ROUTES.live} element={<InstagramPage />} />
      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path={ROUTES.contact} element={<ContactPage />} />
      <Route path={ROUTES.waitlist} element={<WaitlistPage />} />
      <Route path="/art-feed" element={<Navigate to={ROUTES.live} replace />} />
      <Route path="*" element={<NotFound />} />
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[var(--jpg-cream)] focus:px-4 focus:py-3 focus:text-[var(--jpg-black)]"
        >
          Skip to content
        </a>
        <RouteSeo />
        <ScrollToTop />
        <InstagramProvider>

          <Navbar />
          <main id="main">
            <AppRoutes />
          </main>
          <Footer />
        </InstagramProvider>
      </div>
    </Router>
  )
}

export default App
