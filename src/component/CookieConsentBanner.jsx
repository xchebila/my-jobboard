import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../style/CookieConsentBanner.css';
import CookiePolicy from '../pages/CookiePolicy';

const CookieConsentBanner = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const isAccepted = Cookies.get('cookieAccepted');
    if (isAccepted) {
      setAccepted(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('cookieAccepted', 'true', { expires: 365 });
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <CookiePolicy />
      <button onClick={handleAcceptCookies}>Accepter</button>
      <a href="/politique-de-confidentialite">En savoir plus</a>
    </div>
  );
};

export default CookieConsentBanner;