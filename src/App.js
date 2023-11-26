import React, { useState } from 'react';
import AdvertisementsPage from './pages/AdvertisementsPage';
import MyNav from './component/MyNav';
import { Routes, Route } from "react-router-dom";
import UserLogin from './pages/UserLogin';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import JobCard from './component/JobCard';
import AboutPage from './pages/AboutPage';
import Footer from './component/Footer';
import CookiePolicy from './pages/CookiePolicy';
import CookiePreferences from './pages/CookiePreferences';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import BackOffice from './pages/BackOffice';
import UserProfilePage from './pages/UserProfilPage';
import CookieConsentBanner from './component/CookieConsentBanner';
import Settings from './pages/Settings';
import AdminGuard from './component/AdminGuard';

function App() {
  const [cookieAccepted, setCookieAccepted] = useState(false);

  const handleAcceptCookies = () => {
    setCookieAccepted(true);
  };

  return (
    <div className="App">
      {!cookieAccepted && <CookieConsentBanner onAccept={handleAcceptCookies} />}

      <div className="content">
        <MyNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobcard/:id" element={<JobCard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profil" element={<UserProfilePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <BackOffice />
              </AdminGuard>
            }
          />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
