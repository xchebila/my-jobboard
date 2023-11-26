import React, { useState, useEffect } from 'react';

const AdminAnnonce = () => {
  const [tableData, setTableData] = useState([]);
  const [editedCell, setEditedCell] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    Titre: '',
    Description: '',
    Niveau: '',
    Date: '',
    FullDescription: '',
    Horaire: '',
    Salaire: '',
    id_Entreprise: '',
  });

  useEffect(() => {
    fetch('http://localhost:5500/Annonce/get')
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.map((item) => ({
          ...item,
          Titre: item.Titre || 'NULL',
          Description: item.Description || 'NULL',
          Niveau: item.Niveau || 'NULL',
          Date: item.Date || 'NULL',
          FullDescription: item.FullDescription || 'NULL',
          Horaire: item.Horaire || 'NULL',
          Salaire: item.Salaire || 'NULL',
          id_Entreprise: item.id_Entreprise || 'NULL',
        }));
        setTableData(cleanedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données Annonce :', error);
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

    fetch(`http://localhost:5500/Annonce/put/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l\'annonce :', error);
      });
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Etes vous sûr de vouloir supprimer la colonne ?')){
      fetch(`http://localhost:5500/Annonce/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedData = tableData.filter((item) => item.id !== id);
        setTableData(updatedData);
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de l\'annonce :', error);
      });
    }
  };

  const handleAddItem = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewItem({
      Titre: '',
      Description: '',
      Niveau: '',
      Date: '',
      FullDescription: '',
      Horaire: '',
      Salaire: '',
      id_Entreprise: '',
    });
  };

  const handleItemInputChange = (field, value) => {
    setNewItem({
      ...newItem,
      [field]: value,
    });
  };

  const handleAddItemSubmit = () => {
    fetch('http://localhost:5500/Annonce/post', {
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
          Titre: '',
          Description: '',
          Niveau: '',
          Date: '',
          FullDescription: '',
          Horaire: '',
          Salaire: '',
          id_Entreprise: '',
        });

        fetch('http://localhost:5500/Annonce/get')
          .then((response) => response.json())
          .then((data) => {
            const cleanedData = data.map((item) => ({
              ...item,
              Titre: item.Titre || '',
              Description: item.Description || '',
              Niveau: item.Niveau || '',
              Date: item.Date || '',
              FullDescription: item.FullDescription || '',
              Horaire: item.Horaire || '',
              Salaire: item.Salaire || '',
              id_Entreprise: item.id_Entreprise || '',
            }));
            setTableData(cleanedData);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données Annonce :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de l\'annonce :', error);
      });
  };

  return (
    <div>
      <h2>Table Annonce</h2>
      {isAdding ? (
        <div>
          <input
            type="text"
            placeholder="Titre"
            value={newItem.Titre}
            onChange={(e) => handleItemInputChange('Titre', e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.Description}
            onChange={(e) => handleItemInputChange('Description', e.target.value)}
          />
          <input
            type="text"
            placeholder="Niveau"
            value={newItem.Niveau}
            onChange={(e) => handleItemInputChange('Niveau', e.target.value)}
          />
          <input
            type="text"
            placeholder="Date"
            value={newItem.Date}
            onChange={(e) => handleItemInputChange('Date', e.target.value)}
          />
          <input
            type="text"
            placeholder="FullDescription"
            value={newItem.FullDescription}
            onChange={(e) => handleItemInputChange('FullDescription', e.target.value)}
          />
          <input
            type="text"
            placeholder="Horaire"
            value={newItem.Horaire}
            onChange={(e) => handleItemInputChange('Horaire', e.target.value)}
          />
          <input
            type="text"
            placeholder="Salaire"
            value={newItem.Salaire}
            onChange={(e) => handleItemInputChange('Salaire', e.target.value)}
          />
          <input
            type="text"
            placeholder="id_Entreprise"
            value={newItem.id_Entreprise}
            onChange={(e) => handleItemInputChange('id_Entreprise', e.target.value)}
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
                <th>Titre</th>
                <th>Description</th>
                <th>Niveau</th>
                <th>Date</th>
                <th>FullDescription</th>
                <th>Horaire</th>
                <th>Salaire</th>
                <th>id_Entreprise</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {editedCell === `${item.id}-titre` ? (
                      <input
                        type="text"
                        value={item.Titre}
                        onChange={(e) => handleFieldChange(item.id, 'Titre', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-titre`)}>{item.Titre}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-description` ? (
                      <input
                        type="text"
                        value={item.Description}
                        onChange={(e) => handleFieldChange(item.id, 'Description', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-description`)}>{item.Description}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-niveau` ? (
                      <input
                        type="text"
                        value={item.Niveau}
                        onChange={(e) => handleFieldChange(item.id, 'Niveau', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-niveau`)}>{item.Niveau}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-date` ? (
                      <input
                        type="text"
                        value={item.Date}
                        onChange={(e) => handleFieldChange(item.id, 'Date', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-date`)}>{item.Date}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-fulldescription` ? (
                      <input
                        type="text"
                        value={item.FullDescription}
                        onChange={(e) => handleFieldChange(item.id, 'FullDescription', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-fulldescription`)}>{item.FullDescription}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-horaire` ? (
                      <input
                        type="text"
                        value={item.Horaire}
                        onChange={(e) => handleFieldChange(item.id, 'Horaire', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-horaire`)}>{item.Horaire}</span>
                    )}
                  </td>
                  <td>
                    {editedCell === `${item.id}-salaire` ? (
                      <input
                        type="text"
                        value={item.Salaire}
                        onChange={(e) => handleFieldChange(item.id, 'Salaire', e.target.value)}
                      />
                    ) : (
                      <span onClick={() => setEditedCell(`${item.id}-salaire`)}>{item.Salaire}</span>
                    )}
                  </td>
                  <td>{item.id_Entreprise}</td>
                  <td>
                    <button className="admin-button" onClick={() => handleDeleteItem(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button className="admin-button" onClick={handleAddItem}>Ajouter une annonce</button>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAnnonce;
