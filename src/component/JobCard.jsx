import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/JobCard.css';
import Cookies from 'js-cookie';
import Form from './Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const JobCard = () => {
  const { id } = useParams();
  const candidatId = Cookies.get('userId');

  const [annonce, setAnnonce] = useState({});
  const isUserLoggedIn = !!Cookies.get('userToken');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5500/JobCard/${id}`)
      .then((response) => response.json())
      .then((data) => setAnnonce(data[0]))
      .catch((error) => console.error('Erreur lors de la récupération des détails de l\'annonce :', error));
  }, [id]);

  const dateStr = annonce.Date; // Utilisez la date depuis votre base de données

  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Les mois sont indexés à partir de zéro, donc ajoutez 1
  const year = dateObj.getFullYear() % 100; // Récupérez les deux derniers chiffres de l'année

  // Formatez la date au format "jj/mm/aa"
  const formattedDate = `${day}/${month}/${year}`;


  const handleApplyClick = () => {
    if (isUserLoggedIn) {
      confirmAlert({
        title: 'Candidature',
        message: `Êtes-vous sûr de vouloir postuler pour l'annonce ${annonce.Titre} avec votre CV ?`,
        buttons: [
          {
            label: 'Oui',
            onClick: () => {
              sendApplicationEmail(annonce.id);
            },
          },
          {
            label: 'Non',
            onClick: () => {},
          },
        ],
      });
    } else {
      setShowForm(true);
    }
  };

  const sendApplicationEmail = (annonceId) => {
    const dataToSend = {
      candidatId: candidatId,
      annonceId: annonceId
    };

    fetch(`http://localhost:5500/postuler`, {
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
  };

  return (
    <div className="job-card-container">
      <ToastContainer />
      <div className="card ad-details">
  <div className="image-container card-job">
    <img src={annonce.Image} alt={annonce.Titre} className="image card-job" />
  </div>
  <h2 className="title h2-size card-job-featured">{annonce.Titre}</h2>
  <div className="ad-details-category-container">
    <div className="ad-details-titles">
      <div className="ad-details-category-title-container">
        <img src="/img/icon-location.svg" alt="Location Icon" className="card-job-category-title-icon" />
        <div>Lieu</div>
      </div>
      <div className="ad-details-category-title-container">
        <img src="/img/icon-level.svg" alt="Level Icon" className="card-job-category-title-icon" />
        <div>Niveau</div>
      </div>
      <div className="ad-details-category-title-container">
        <img src="/img/icon-department.svg" alt="Department Icon" className="card-job-category-title-icon" />
        <div>Département</div>
      </div>
      <div className="ad-details-category-title-container">
        <img src="/img/icon-salary.svg" alt="Salary Icon" className="card-job-category-title-icon" />
        <div>Salaire</div>
      </div>
      <div className="ad-details-category-title-container">
        <img src="/img/icon-salary.svg" alt="Date Icon" className="card-job-category-title-icon" />
        <div>Parution</div>
      </div>
    </div>
    <div className="ad-details-data">
    <div className="ad-details-category-text-container">
      <div className="ad-details-category-text">{annonce.Lieu}</div>
    </div>
    <div className="ad-details-category-text-container">
      <div className="ad-details-category-text">{annonce.Niveau}</div>
    </div>  
    <div className="ad-details-category-text-container">
      <div className="ad-details-category-text">{annonce.Domaine}</div>
    </div>
    <div className="ad-details-category-text-container">
      <div className="ad-details-category-text">{annonce.Salaire}</div>
    </div>
    <div className="ad-details-category-text-container">
      <div className="ad-details-category-text">{formattedDate}</div>
    </div>    
    </div>
  </div>
  <hr className="divider" />
  <p className="ad-details-description">
    {annonce.FullDescription}
  </p>
  <button onClick={handleApplyClick} className="button-primary">
    {isUserLoggedIn ? "Postuler avec CV" : "Postuler"}
  </button>
</div>

      {showForm && (
        <div className="form-container">
          <Form annonce={annonce} />
        </div>
      )}
    </div>
  );
};

export default JobCard;
