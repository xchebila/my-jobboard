import React, { useState, useEffect } from 'react';

const LatestAdvertisements = () => {
  const [latestAnnonces, setLatestAnnonces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5500/Annonce')
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const latest = data.slice(0, 3);

        setLatestAnnonces(latest);
      })
      .catch((error) => console.error('Erreur lors de la récupération des annonces :', error));
  }, []);

  return (
    <div>
      <h2>Dernières annonces</h2>
      <div className="featured-jobs-container">
        {latestAnnonces.map((annonce, index) => (
          <div key={index} className="featured-job-item w-dyn-item">
            <div className="card job featured w-inline-block">
              <div className="split-content card-job-left">
                <div className="image-container card-job">
                  <img src={annonce.Image} alt={annonce.Titre} className="image card-job" />
                </div>
                <div className="card-job-title-container">
                  <h3 className="title h6-size card-job-featured">{annonce.Titre}</h3>
                  <div className="card-link-container">
                    <div className="card-link featured">
                      <a href={`/jobcard/${annonce.id}`}>
                        <button className="button-primary button-primary.small">En savoir plus</button>
                      </a>
                    </div>
                    <div className="card-link-arrow">
                      <div className="card-link-arrow-1 featured"></div>
                      <div className="card-link-arrow-2 featured"></div>
                      <div className="card-link-arrow-3 featured"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-job-category-text">
                    {annonce.Description}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestAdvertisements;
