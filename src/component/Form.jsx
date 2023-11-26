import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Form({ annonce }) {
  const [candidSpontData, setCandidSpontData] = useState({
    Nom: '',
    Email: '',
    Téléphone: '',
    Message: '',
    id_Annonce: annonce.id,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(false); 

  const handleCandidSpont = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!confirmation) {
      setIsSubmitting(false);
      alert('Confirmation requise pour soumettre la candidature spontanée.');
      return;
    }

    fetch('http://localhost:5500/CandidSpont/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidSpontData),
    })
      .then((response) => response.json())
      .then(() => {
        setCandidSpontData({
          Nom: '',
          Email: '',
          Téléphone: '',
          Message: '',
          id_Annonce: annonce.id,
        });
        setIsSubmitting(false);
        setConfirmation(false);
        toast.success(`Vous avez postulé pour l'annonce ${annonce.Titre} avec succès !`, {
          position: "bottom-right"
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Erreur lors de la soumission de la candidature spontanée :', error);
        toast.warning(`Erreur lors de la soumission de la candidature spontanée`, {
          position: "bottom-right"
        });
      });
  };

  useEffect(() => {
    if (!candidSpontData.Nom && !candidSpontData.Email && !candidSpontData.Téléphone && !candidSpontData.Message) {
      setIsSubmitting(false);
    }
  }, [candidSpontData]);

  return (
    <div className="w-dyn-list" id="form">
      <ToastContainer />
      <div role="list" className="featured-jobs-grid w-dyn-items">
        <div role="listitem" className="featured-job-item w-dyn-item">
          <div className="card job featured w-inline-block">
            <div className="split-content card-job-left">
              <form className="application-form" onSubmit={handleCandidSpont}>
                <h3 className="title h6-size">{`Postuler pour ${annonce.Titre}`}</h3>
                <label htmlFor="Nom">Nom:</label>
                <input
                  type="text"
                  id="Nom"
                  name="Nom"
                  required
                  value={candidSpontData.Nom}
                  onChange={(e) => setCandidSpontData({ ...candidSpontData, Nom: e.target.value })}
                />
                <br />

                <label htmlFor="Email">Email:</label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  required
                  value={candidSpontData.Email}
                  onChange={(e) => setCandidSpontData({ ...candidSpontData, Email: e.target.value })}
                />
                <br />

                <label htmlFor="Téléphone">Téléphone:</label>
                <input
                  type="tel"
                  id="Téléphone"
                  name="Téléphone"
                  required
                  value={candidSpontData.Téléphone}
                  onChange={(e) => setCandidSpontData({ ...candidSpontData, Téléphone: e.target.value })}
                />
                <br />

                <label htmlFor="Message">Message:</label>
                <textarea
                  id="Message"
                  name="Message"
                  required
                  value={candidSpontData.Message}
                  onChange={(e) => setCandidSpontData({ ...candidSpontData, Message: e.target.value })}
                ></textarea>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={confirmation}
                    onChange={() => setConfirmation(!confirmation)}
                  />
                  Je confirme l'envoi de la candidature spontanée
                </label>
                <input
                  type="submit"
                  className="button-primary button-primary.small"
                  value={isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  id="submit-form"
                  disabled={isSubmitting}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
