import React from 'react';
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/terms-of-service">Terms of Service</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/cookie-policy">Cookie Policy</a>
        <a href="/cookie-preferences">Cookie Preferences</a>
      </div>
      <div className="footer-text">
        © {new Date().getFullYear()} My JobBoard. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;