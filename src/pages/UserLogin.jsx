import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/UserLogin.css';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    mdp: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.email) {
      errors.email = "L'email est obligatoire.";
    }
    if (!formData.mdp) {
      errors.mdp = "Le mot de passe est obligatoire.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      const userData = {
        email: formData.email,
        mdp: formData.mdp,
      };

      fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Authentification échouée');
          }
        })
        .then((data) => {
          Cookies.set('userToken', data.token, { expires: 7 });
          Cookies.set('userId', data.id, { expires: 7 });
          if (data.role.toLowerCase() === 'admin') {
            toast.success("Connexion admin réussie, vous allez être redirigé !", {
              position: "bottom-right"
            });
          } else {
            toast.success("Connexion réussie, vous allez être redirigé !", {
              position: "bottom-right"
            });
          }
        
          setTimeout(() => {
            if (data.role.toLowerCase() === 'admin') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/advertisements';
            }
          }, 2000);
        })
        .catch((error) => {
          toast.error("Erreur lors de l'authentification : " + error.message,{
            position: "bottom-right"
          });
        });
    }
  };

  return (
    <div className="center-div">
      <ToastContainer />
      <div className="login-container">
        <form className="form-login" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" value={formData.email} onChange={handleInputChange} />
          {formErrors.email && <span className="error">{formErrors.email}</span>}

          <label htmlFor="password">Mot de passe</label>
          <input type="password" name="mdp" id="password" value={formData.mdp} onChange={handleInputChange} />
          {formErrors.mdp && <span className="error">{formErrors.mdp}</span>}

          <button type="submit" className="button-primary">
            Connexion
          </button>
        </form>
        <p>
          Vous n'avez pas encore de compte ? <Link to="/register">Créez un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;