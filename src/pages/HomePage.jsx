import React from 'react';
import '../style/HomePage.css'; 
import Carousel from '../component/Carousel';

function HomePage() {
  return (
    <div className="home-page">
      <header className="header">
        <h1>Bienvenue sur My JobBoard</h1>
        <p>Trouvez l'emploi de vos rêves aujourd'hui !</p>
        <Carousel />
      </header>

      <section className="features">
        <div className="feature">
          <i className="fas fa-search"></i>
          <h2>Recherche Facile</h2>
          <p>Recherchez par titre, lieu, entreprise, ou compétences spécifiques.</p>
        </div>
        <div className="feature">
          <i className="fas fa-briefcase"></i>
          <h2>Offres d'Emploi Variées</h2>
          <p>Découvrez des milliers d'opportunités dans divers secteurs.</p>
        </div>
        <div className="feature">
          <i className="fas fa-user-circle"></i>
          <h2>Compte Personnel</h2>
          <p>Créez un compte pour envoyer vos CV directement aux entreprises.</p>
        </div>
      </section>

      <section className="call-to-action">
        <h2>Prêt à Commencer Votre Recherche d'Emploi ?</h2>
        <a href="/advertisements" className="btn button-primary">Voir les Offres d'Emploi</a>
      </section>
    </div>
  );
}

export default HomePage;
