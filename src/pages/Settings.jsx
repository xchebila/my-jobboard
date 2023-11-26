import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../style/UserProfilPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Settings = () => {
  const [userData, setUserData] = useState({});
  const [editedUserData, setEditedUserData] = useState({});
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const userId = Cookies.get('userId');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5500/Profil/get/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setUserData(data[0]);
            setEditedUserData(data[0]);
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        });
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setConfirmEmail('');
    setConfirmPassword('');

    setEditedUserData({ ...userData });

    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (confirmEmail === editedUserData.Email && confirmEmail === editedUserData.Email) {
      fetch(`http://localhost:5500/Profil/put/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUserData),
      })
        .then((response) => response.json())
        .then(() => {
          setIsEditing(false);
          fetch(`http://localhost:5500/Profil/get/${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.length > 0) {
                setUserData(data[0]);
                setEditedUserData(data[0]);
                toast.success("Paramètres mis à jour avec succès.", { position: "bottom-right" });
              }
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
            });
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour des données de l\'utilisateur :', error);
          toast.error("Erreur lors de la mise à jour du profil. Veuillez réessayer.", { position: "bottom-right" });
        });
    } else {
      toast.error("Les champs de confirmation d'e-mail et de mot de passe ne correspondent pas.", { position: "bottom-right" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      <h2>Paramètres du compte de {userData.Prenom} {userData.Nom}</h2>
      {isEditing ? (
        <div>
          <table className="profile-table">
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{editedUserData.id}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <input
                    type="text"
                    name="Email"
                    value={editedUserData.Email}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>Confirmer Email:</td>
                <td>
                  <input
                    type="text"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>Mot de passe:</td>
                <td>
                  <input
                    type="password"
                    name="mdp"
                    value={editedUserData.mdp}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>Confirmer Mot de passe:</td>
                <td>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="profile-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="profile-buttons">
            <button onClick={handleSaveClick} className="profile-edit-button profile-save-button">
              Enregistrer
            </button>
            <button onClick={handleCancelClick} className="profile-edit-button profile-cancel-button">
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div>
          <table className="profile-table">
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{userData.id}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{userData.Email}</td>
              </tr>
              <tr>
                <td>Mot de passe:</td>
                <td>**********</td>
              </tr>
            </tbody>
          </table>
          <div className="profile-buttons">
            <button onClick={handleEditClick} className="profile-edit-button">
              Modifier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;