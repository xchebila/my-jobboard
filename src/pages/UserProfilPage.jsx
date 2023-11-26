import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../style/UserProfilPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [editedUserData, setEditedUserData] = useState({});
  const userId = Cookies.get('userId');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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
  }, [userId]);  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    formData.append('Nom', editedUserData.Nom);
    formData.append('Prenom', editedUserData.Prenom);
    formData.append('Telephone', editedUserData.Telephone);
    formData.append('CV', editedUserData.CV);
    formData.append('MDP', editedUserData.MDP);
  
    fetch(`http://localhost:5500/Profil/put/${userId}`, {
      method: 'PUT',
      body: formData,
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
              toast.success("Profil mis à jour avec succès.", { position: "bottom-right" });
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
            toast.error("Erreur lors de la récupération des données de l'utilisateur. Veuillez réessayer.", { position: "bottom-right" });
          });
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des données de l\'utilisateur :', error);
        toast.error("Erreur lors de la mise à jour du profil. Veuillez réessayer.", { position: "bottom-right" });
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setEditedUserData({ ...editedUserData, [name]: file });
    } else {
      setEditedUserData({ ...editedUserData, [name]: value });
    }
  };
  

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUserData({ ...userData });
  };

  function getFileName(filePath) {
    if (filePath) {
      const pathArray = filePath.split('/');
      const fileName = pathArray[pathArray.length - 1];
      return fileName;
    }
    return '';
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <h2>Profil de {userData.Prenom} {userData.Nom}</h2>
      {isEditing ? (
        <div>
          <table className="profile-table">
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{editedUserData.id}</td>
              </tr>
              <tr>
                <td>Nom:</td>
                <td>
                  <input
                    type="text"
                    name="Nom"
                    value={editedUserData.Nom}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>Prénom:</td>
                <td>
                  <input
                    type="text"
                    name="Prenom"
                    value={editedUserData.Prenom}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>Téléphone:</td>
                <td>
                  <input
                    type="text"
                    name="Telephone"
                    value={editedUserData.Telephone}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </td>
              </tr>
              <tr>
                <td>CV:</td>
                <td>
                  <input
                    type="file"
                    name="CV"
                    onChange={handleInputChange}
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
                <td>Nom:</td>
                <td>{userData.Nom}</td>
              </tr>
              <tr>
                <td>Prénom:</td>
                <td>{userData.Prenom}</td>
              </tr>
              <tr>
                <td>Téléphone:</td>
                <td>{userData.Telephone}</td>
              </tr>
              <tr>
                <td>CV:</td>
                <td>{getFileName(userData.CV)}</td>
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

export default UserProfilePage;
