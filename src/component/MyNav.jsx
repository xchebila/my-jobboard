import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../style/MyNav.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const MyNav = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  function isUserLoggedIn() {
    return !!Cookies.get('userToken');
  }

  function handleLogout() {
    confirmAlert({
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          label: 'Oui',
          onClick: () => {
            Cookies.remove('userToken');
            Cookies.remove('userId');
            window.location.href = '/';
          },
        },
        {
          label: 'Non',
          onClick: () => {},
        },
      ],
    });
  }
  

  const userIsLoggedIn = isUserLoggedIn();

  return (
    <nav className="navbar">
      <div className="div-logo">
        <Link to="/" className="logo-link">
          <img className="logo-jobboard" src="/img/logo-jobboard.png" alt="Logo Jobboard" />
          <p>My Jobboard</p>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/advertisements">Annonces</Link></li>
        <li><Link to="/about">A Propos</Link></li>

        <div className="account">
          {userIsLoggedIn ? (
            <div className="dropdown">
              <li className="dropbtn" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                <Link to="#">Profil</Link>
                <i className="fa fa-caret-down"></i>
              </li>
              {isProfileDropdownOpen && (
                <div className="dropdown-content">
                  <li onClick={() => navigate('/profil')}>Gestion du Profil</li>
                  <li onClick={() => navigate('/settings')}>Paramètres</li>
                  <li onClick={handleLogout}>Se déconnecter</li>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Se connecter</Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default MyNav;
