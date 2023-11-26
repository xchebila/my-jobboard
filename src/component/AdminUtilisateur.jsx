import React, { useState, useEffect } from 'react';

const AdminUtilisateur = () => {
  const [tableData, setTableData] = useState([]);
  const [editedCell, setEditedCell] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    Mdp: '',
    Telephone: '',
    CV: '',
    Roles: '',
  });

  useEffect(() => {
    fetch('http://localhost:5500/Utilisateur/get')
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.map((item) => ({
          ...item,
        Nom: item.Nom || 'NULL',
        Prenom: item.Prenom || 'NULL',
        Email: item.Email || 'NULL', 
        Mdp: item.mdp || '********',
        Telephone: item.Telephone || 'NULL', 
        CV: item.CV || 'NULL', 
        Roles: item.Roles || 'NULL', 
        }));
        setTableData(cleanedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données Utilisateur :', error);
      });
  }, []);

  const handleFieldChange = (id, field, value) => {
    const updatedData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setTableData(updatedData);

    fetch(`http://localhost:5500/Utilisateur/put/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      });
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Etes vous sûr de vouloir supprimer la colonne ?')){
        fetch(`http://localhost:5500/Utilisateur/delete/${id}`, {
            method: 'DELETE',
          })
            .then(() => {
              const updatedData = tableData.filter((item) => item.id !== id);
              setTableData(updatedData);
            })
            .catch((error) => {
              console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            });
    }

  };

  const handleAddUser = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewUser({
      Nom: '',
      Prenom: '',
      Email: '',
      Mdp: '',
      Telephone: '',
      CV: '',
      Roles: '',
    });
  };

  const handleUserInputChange = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value,
    });
  };

  const handleAddUserSubmit = () => {
    fetch('http://localhost:5500/Utilisateur/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAdding(false);
        setNewUser({
          Nom: '',
          Prenom: '',
          Email: '',
          Mdp: '',
          Telephone: '',
          CV: '',
          Roles: '',
        });
        fetch('http://localhost:5500/Utilisateur/get')
          .then((response) => response.json())
          .then((data) => {
            setTableData(data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données Utilisateur :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
      });
  };

  return (
    <div>
      <h2>Table Utilisateur</h2>
      
      {isAdding ? (
        <div>
          <input
            type="text"
            placeholder="Nom"
            value={newUser.Nom}
            onChange={(e) => handleUserInputChange('Nom', e.target.value)}
          />
          <input
            type="text"
            placeholder="Prenom"
            value={newUser.Prenom}
            onChange={(e) => handleUserInputChange('Prenom', e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={newUser.Email}
            onChange={(e) => handleUserInputChange('Email', e.target.value)}
          />
          <input
            type="text"
            placeholder="Mdp"
            value={newUser.Mdp}
            onChange={(e) => handleUserInputChange('Mdp', e.target.value)}
          />
          <input
            type="text"
            placeholder="Telephone"
            value={newUser.Telephone}
            onChange={(e) => handleUserInputChange('Telephone', e.target.value)}
          />
          <input
            type="text"
            placeholder="CV"
            value={newUser.CV}
            onChange={(e) => handleUserInputChange('CV', e.target.value)}
          />
          <input
            type="text"
            placeholder="Roles"
            value={newUser.Roles}
            onChange={(e) => handleUserInputChange('Roles', e.target.value)}
          />
          <button className="admin-button" onClick={handleAddUserSubmit}>Ajouter</button>
          <button className="admin-button" onClick={handleCancelAdd}>Annuler</button>
        </div>
      ) : (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Email</th>
                <th>Mdp</th>
                <th>Telephone</th>
                <th>CV</th>
                <th>Roles</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {editedCell === `${item.id}-nom` ? (
                      <input
                        type="text"
                        value={item.Nom || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Nom', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-nom`)}>{item.Nom || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-prenom` ? (
                      <input
                        type="text"
                        value={item.Prenom || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Prenom', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-prenom`)}>{item.Prenom || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-email` ? (
                      <input
                        type="text"
                        value={item.Email || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Email', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-email`)}>{item.Email || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-mdp` ? (
                      <input
                        type="text"
                        value={item.Mdp || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Mdp', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-mdp`)}>{item.Mdp || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-telephone` ? (
                      <input
                        type="text"
                        value={item.Telephone || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Telephone', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-telephone`)}>{item.Telephone || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-cv` ? (
                      <input
                        type="text"
                        value={item.CV || ''}
                        onChange={(e) => handleFieldChange(item.id, 'CV', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-cv`)}>{item.CV || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-roles` ? (
                      <input
                        type="text"
                        value={item.Roles || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Roles', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-roles`)}>{item.Roles || ''}</span>
                    )}
                  </td>
                  <td>
                    <button className="admin-button" onClick={() => handleDeleteItem(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button className="admin-button" onClick={handleAddUser}>Ajouter un utilisateur</button>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUtilisateur;
