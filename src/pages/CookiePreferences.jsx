import React from 'react';
import Cookies from 'js-cookie';
import '../style/FooterPages.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CookiePreferences = () => {
  const handleDeleteCookie = () => {
    confirmAlert({
      title: 'Cookies',
      message: 'SUPPRIMER LES COOKIES VOUS DÉCONNECTERA. Êtes-vous sûr de vouloir continuer ?',
      buttons: [
        {
          label: 'Oui',
          onClick: () => {
            Cookies.remove('cookieAccepted');
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
  };

  return (
    <div>
      <h1>Préférences de cookies et cookies de session</h1>
      <p>
        1. Gestion des préférences
        Vous pouvez gérer vos préférences de cookies en utilisant notre outil de gestion des cookies. Vous pouvez choisir d'accepter ou de refuser certains types de cookies.
      </p>
      <p>
        2. Modification des préférences
        Vous pouvez modifier vos préférences de cookies à tout moment en accédant à la page de gestion des cookies.
      </p>
      <p>
        3. Cookies de session (Rester connecté)
        Lorsque vous vous connectez, un cookie de session est créé pour vous permettre de rester connecté pendant une période déterminée. Ce cookie est supprimé lorsque vous vous déconnectez.
      </p>
      <p>Date de la dernière mise à jour : [10/2023]</p>

      <button onClick={handleDeleteCookie}>Supprimer les cookies</button>
    </div>
  );
}

export default CookiePreferences;
