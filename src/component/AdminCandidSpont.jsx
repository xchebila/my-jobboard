import React, { useState, useEffect } from 'react';

const AdminCandidSpont = () => {
  const [tableData, setTableData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCandidat, setNewCandidat] = useState({
    Nom: '',
    Email: '',
    Telephone: '',
    Message: '',
    id_Annonce: '',
  });
  const [editedCell, setEditedCell] = useState(null);

  useEffect(() => {
    // Chargez les données initiales depuis l'API
    fetch('http://localhost:5500/CandidSpont/get')
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.map((item) => ({
          ...item,
          Nom: item.Nom || 'NULL',
          Email: item.Email || 'NULL',
          Telephone: item.Telephone || 'NULL',
          Message: item.Message || 'NULL',
          id_Annonce: item.id_Annonce || 'NULL',
        }));
        setTableData(cleanedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données CandidSpont :', error);
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

    fetch(`http://localhost:5500/CandidSpont/put/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la candidature spontanée :', error);
      });
  };

  const handleDeleteItem = (id) => {
    fetch(`http://localhost:5500/CandidSpont/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedData = tableData.filter((item) => item.id !== id);
        setTableData(updatedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de la candidature spontanée :', error);
      });
  };

  const handleAddCandidat = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCandidat({
      Nom: '',
      Email: '',
      Telephone: '',
      Message: '',
      id_Annonce: '',
    });
  };

  const handleCandidatInputChange = (field, value) => {
    setNewCandidat({
      ...newCandidat,
      [field]: value,
    });
  };

  const handleAddCandidatSubmit = () => {
    if (!newCandidat.id_Annonce) {
      alert("N'oubliez pas de remplir le champ id_Annonce");
      return;
    }
  
    fetch('http://localhost:5500/CandidSpont/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCandidat),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAdding(false);
        setNewCandidat({
          Nom: '',
          Email: '',
          Telephone: '',
          Message: '',
          id_Annonce: '',
        });
        fetch('http://localhost:5500/CandidSpont/get')
          .then((response) => response.json())
          .then((data) => {
            setTableData(data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données CandidSpont :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de la candidature spontanée :', error);
      });
  };
  

  return (
    <div>
      <h2>Table Candidatures Spontanées</h2>
      {isAdding ? (
        <div>
          <input
            type="text"
            placeholder="Nom"
            value={newCandidat.Nom}
            onChange={(e) => handleCandidatInputChange('Nom', e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={newCandidat.Email}
            onChange={(e) => handleCandidatInputChange('Email', e.target.value)}
          />
          <input
            type="text"
            placeholder="Telephone"
            value={newCandidat.Telephone}
            onChange={(e) => handleCandidatInputChange('Telephone', e.target.value)}
          />
          <input
            type="text"
            placeholder="Message"
            value={newCandidat.Message}
            onChange={(e) => handleCandidatInputChange('Message', e.target.value)}
          />
          <input
            type="text"
            placeholder="id_Annonce"
            value={newCandidat.id_Annonce}
            onChange={(e) => handleCandidatInputChange('id_Annonce', e.target.value)}
          />
          <button className="admin-button" onClick={handleAddCandidatSubmit}>Ajouter</button>
          <button className="admin-button" onClick={handleCancelAdd}>Annuler</button>
        </div>
      ) : (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nom</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Message</th>
                <th>id_Annonce</th>
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
                    {editedCell === `${item.id}-message` ? (
                      <input
                        type="text"
                        value={item.Message || ''}
                        onChange={(e) => handleFieldChange(item.id, 'Message', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-message`)}>{item.Message || ''}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-id_Annonce` ? (
                      <input
                        type="text"
                        value={item.id_Annonce || ''}
                        onChange={(e) => handleFieldChange(item.id, 'id_Annonce', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-id_Annonce`)}>{item.id_Annonce || ''}</span>
                    )}
                  </td>
                  <td>
                    <button className="admin-button" onClick={() => handleDeleteItem(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button className="admin-button" onClick={handleAddCandidat}>Ajouter une candidature spontanée</button>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCandidSpont;
