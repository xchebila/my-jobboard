import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Form from './Form';
import '../style/Advertisements.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

function Advertisements() {
  const [annonces, setAnnonces] = useState([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const isUserLoggedIn = !!Cookies.get('userToken');
  const candidatId = Cookies.get('userId')

  useEffect(() => {
    fetch('http://localhost:5500/Annonce')
      .then((response) => response.json())
      .then((data) => setAnnonces(data))
      .catch((error) => console.error('Erreur lors de la récupération des annonces :', error));
  }, []);

  
  const handleApplyClick = (annonce) => {
    if (isUserLoggedIn) {
      confirmAlert({
        title: 'Candidature',
        message: `Êtes-vous sûr de vouloir postuler pour l'annonce ${annonce.Titre} ?`,
        buttons: [
          {
            label: 'Oui',
            onClick: () => {
              const dataToSend = {
                annonceId: annonce.id, 
                candidatId: parseInt(candidatId)
              };
  
              fetch('http://localhost:5500/postuler', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    toast.success(`Vous avez postulé pour l'annonce ${annonce.Titre} avec succès !`, {
                      position: "bottom-right"
                    });
                  } else {
                    toast.error(`Une erreur s'est produite lors de la candidature.`, {
                      position: "bottom-right"
                    });
                  }
                })
                .catch((error) => console.error('Erreur lors de la candidature :', error));
            },
          },
          {
            label: 'Non',
            onClick: () => {},
          },
        ],
      });
    } else {
      setSelectedAnnonce(annonce);
    }
  };
  
  

  return (
    <div className="job-board-container">
      <ToastContainer />
      <div className="split-content job-board-content">
        <div className="featured-jobs-container">
          <h2 className="title featured-jobs">Liste des annonces</h2>
          <div className="w-dyn-list">
            <div role="list" className="featured-jobs-grid w-dyn-items">
              {annonces.map((annonce, index) => (
                <div key={index} role="listitem" className="featured-job-item w-dyn-item">
                  <div className="card job featured w-inline-block">
                    <div className="split-content card-job-left">
                      <div className="image-container card-job">
                        <img src={annonce.Image} alt={annonce.Titre} className="image card-job" />
                      </div>
                      <div className="card-job-title-container">
                        <h3 className="title h6-size card-job-featured">{annonce.Titre}</h3>
                        <div className="card-link-container">
                          <div className="card-link featured">
                            <Link to={`/jobcard/${annonce.id}`}>
                              <button className="button-primary button-primary.small">En savoir plus</button>
                            </Link>
                          </div>
                          <div className="card-link-arrow">
                            <div className="card-link-arrow-1 featured"></div>
                            <div className="card-link-arrow-2 featured"></div>
                            <div className="card-link-arrow-3 featured"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="split-content card-job-right">
                      <div className="card-job-category-container">
                        <div className="card-job-category-title-container">
                          <img src="/img/icon-location.svg" alt="Location Icon" className="card-job-category-title-icon" />
                          <div>Lieu</div>
                        </div>
                        <div className="card-job-category-text">{annonce.Lieu}</div>
                      </div>
                      <div className="card-job-category-container">
                        <div className="card-job-category-title-container">
                          <img src="/img/icon-level.svg" alt="Level Icon" className="card-job-category-title-icon" />
                          <div>Niveau</div>
                        </div>
                        <div className="card-job-category-text">{annonce.Niveau}</div>
                      </div>
                      <div className="card-job-category-container">
                        <div className="card-job-category-title-container">
                          <img src="/img/icon-department.svg" alt="Department Icon" className="card-job-category-title-icon" />
                          <div>Département</div>
                        </div>
                        <div className="card-job-category-text">{annonce.Domaine}</div>
                      </div>
                    </div>
                    <button onClick={() => handleApplyClick(annonce)} className="button-primary button-primary.small apply-button" id="btnApply">
                      {isUserLoggedIn ? "Postuler avec votre CV" : "Postuler"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        {selectedAnnonce && !isUserLoggedIn ? <Form annonce={selectedAnnonce} /> : null}
      </div>
    </div>
  );
}

export default Advertisements;