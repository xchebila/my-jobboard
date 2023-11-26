import React, { useState, useEffect } from 'react';

const AdminEntreprise = () => {
  const [tableData, setTableData] = useState([]);
  const [editedCell, setEditedCell] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    Nom: '',
    Lieu: '',
    Domaine: '',
    Description: '',
    Email: '',
  });

  useEffect(() => {
    fetch('http://localhost:5500/Entreprise/get')
      .then((response) => response.json())
      .then((data) => {
        // Remplacez les valeurs NULL par des chaînes vides
        const cleanedData = data.map((item) => ({
          ...item,
          Nom: item.Nom || '',
          Lieu: item.Lieu || '',
          Domaine: item.Domaine || '',
          Description: item.Description || '',
          Email: item.Email || '',
        }));
        setTableData(cleanedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données Entreprise :', error);
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

    fetch(`http://localhost:5500/Entreprise/put/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l\'entreprise :', error);
      });
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Etes vous sûr de vouloir supprimer la colonne ?')) {
      fetch(`http://localhost:5500/Entreprise/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedData = tableData.filter((item) => item.id !== id);
        setTableData(updatedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de l\'entreprise :', error);
      });
    }
  };

  const handleAddItem = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewItem({
      Nom: '',
      Lieu: '',
      Domaine: '',
      Description: '',
      Email: '',
    });
  };

  const handleItemInputChange = (field, value) => {
    setNewItem({
      ...newItem,
      [field]: value,
    });
  };

  const handleAddItemSubmit = () => {
    fetch('http://localhost:5500/Entreprise/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAdding(false);
        setNewItem({
          Nom: '',
          Lieu: '',
          Domaine: '',
          Description: '',
          Email: '',
        });
        fetch('http://localhost:5500/Entreprise/get')
          .then((response) => response.json())
          .then((data) => {
            const cleanedData = data.map((item) => ({
              ...item,
              Nom: item.Nom || '',
              Lieu: item.Lieu || '',
              Domaine: item.Domaine || '',
              Description: item.Description || '',
              Email: item.Email || '',
            }));
            setTableData(cleanedData);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données Entreprise :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de l\'entreprise :', error);
      });
  };

  return (
    <div>
      <h2>Table Entreprise</h2>
      {isAdding ? (
        <div>
          <input
            type="text"
            placeholder="Nom"
            value={newItem.Nom}
            onChange={(e) => handleItemInputChange('Nom', e.target.value)}
          />
          <input
            type="text"
            placeholder="Lieu"
            value={newItem.Lieu}
            onChange={(e) => handleItemInputChange('Lieu', e.target.value)}
          />
          <input
            type="text"
            placeholder="Domaine"
            value={newItem.Domaine}
            onChange={(e) => handleItemInputChange('Domaine', e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.Description}
            onChange={(e) => handleItemInputChange('Description', e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={newItem.Email}
            onChange={(e) => handleItemInputChange('Email', e.target.value)}
          />
          <button className="admin-button" onClick={handleAddItemSubmit}>Ajouter</button>
          <button className="admin-button" onClick={handleCancelAdd}>Annuler</button>
        </div>
      ) : (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>id</th>
                <th>Nom</th>
                <th>Lieu</th>
                <th>Domaine</th>
                <th>Description</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {editedCell === `${item.id}-Nom` ? (
                      <input
                        type="text"
                        value={item.Nom}
                        onChange={(e) => handleFieldChange(item.id, 'Nom', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-Nom`)}>{item.Nom}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-Lieu` ? (
                      <input
                        type="text"
                        value={item.Lieu}
                        onChange={(e) => handleFieldChange(item.id, 'Lieu', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-Lieu`)}>{item.Lieu}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-Domaine` ? (
                      <input
                        type="text"
                        value={item.Domaine}
                        onChange={(e) => handleFieldChange(item.id, 'Domaine', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-Domaine`)}>{item.Domaine}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-Description` ? (
                      <input
                        type="text"
                        value={item.Description}
                        onChange={(e) => handleFieldChange(item.id, 'Description', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-Description`)}>{item.Description}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-Email` ? (
                      <input
                        type="text"
                        value={item.Email}
                        onChange={(e) => handleFieldChange(item.id, 'Email', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-Email`)}>{item.Email}</span>
                    )}
                  </td>
                  <td>
                    <button className="admin-button" onClick={() => handleDeleteItem(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button className="admin-button" onClick={handleAddItem}>Ajouter une entreprise</button>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEntreprise;
