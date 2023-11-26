import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/RegisterPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState({
    Nom: '',
    Prenom: '',
    Telephone: '',
    CV: '',
    Email: '',
    mdp: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
  
    setUserFormData({
      ...userFormData,
      [fieldName]: value,
    });
  
    setFormErrors({
      ...formErrors,
      [fieldName]: '',
    });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const errors = {};
  
    if (!userFormData.CV) {
      errors.CV = 'Le CV est obligatoire.';
    } else {
      const fileName = userFormData.CV.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      if (fileExtension !== 'pdf') {
        errors.CV = 'Le CV doit être au format PDF.';
      }
    }
  
    if (!userFormData.nom) {
      errors.Nom = 'Le nom est obligatoire.';
    }
    if (!userFormData.Prenom) {
      errors.Prenom = 'Le prénom est obligatoire.';
    }
    if (!userFormData.Telephone) {
      errors.Telephone = 'Le Telephone est obligatoire.';
    }
    if (!userFormData.Email) {
      errors.Email = 'L\'Email est obligatoire.';
    }
    if (!userFormData.mdp) {
      errors.mdp = 'Le mot de passe est obligatoire.';
    }
    if (userFormData.mdp !== userFormData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      const form = new FormData();
      form.append('Nom', userFormData.nom);
      form.append('Prenom', userFormData.Prenom);
      form.append('Telephone', userFormData.Telephone);
      form.append('CV', userFormData.CV);
      form.append('Email', userFormData.Email);
      form.append('mdp', userFormData.mdp);
      
      fetch('http://localhost:5500/Register', {
        method: 'POST',
        body: form,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw new Error(data.error || 'Erreur lors de l\'inscription');
            });
          }
        })
        .then(() => {
          toast.success('Votre compte a bien été créé !', {
            position: 'bottom-right',
          });
          setTimeout(() => {
            e.target.reset();
            setUserFormData({
              Nom: '',
              Prenom: '',
              Telephone: '',
              CV: '',
              Email: '',
              mdp: '',
              confirmPassword: '',
            });
            setFormErrors({});
            navigate('/login');
          }, 1500);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.', {
            position: 'bottom-right',
          });
        });
    }
  };

  return (
    <div className="center-div2">
      <ToastContainer />
      <div className="registration-container">
        <form className="form-registration" onSubmit={handleSubmit} enctype= "multipart/form-data">
          <label htmlFor="nom">Nom</label>
          <input type="text" name="nom" onChange={handleInputChange} value={userFormData.nom} required />
          {formErrors.nom && <span className="error">{formErrors.nom}</span>}

          <label htmlFor="Prenom">Prénom</label>
          <input type="text" name="Prenom" onChange={handleInputChange} value={userFormData.Prenom} required />
          {formErrors.Prenom && <span className="error">{formErrors.Prenom}</span>}

          <label htmlFor="Telephone">Téléphone</label>
          <input
            type="tel"
            name="Telephone"
            pattern="^(?:(?:\+|00)33|0)\s?[1-9](?:\s?\d{2}){4}$"
            required
            onChange={handleInputChange}
            value={userFormData.Telephone}
          />
          {formErrors.Telephone && <span className="error">{formErrors.Telephone}</span>}

          <label htmlFor="CV">CV</label>
          <input type="file" name="CV" accept=".pdf" onChange={handleInputChange} />
          {formErrors.CV && <span className="error">{formErrors.CV}</span>}

          <label htmlFor="Email">Email</label>
          <input 
          type="email" 
          name="Email" 
          onChange={handleInputChange} 
          value={userFormData.Email} 
          pattern='/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
          title="L'email doit être dans un format valide."
          required />
          {formErrors.Email && <span className="error">{formErrors.Email}</span>}

          <label htmlFor="mdp">Mot de passe</label>
          <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name="mdp"
            onChange={handleInputChange}
            value={userFormData.mdp}
            required
            minLength="8"
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*0-9]).{8,}$"
            title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, et un caractère spécial (!@#$%^&*)."
          />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {formErrors.mdp && <span className="error">{formErrors.mdp}</span>}

          <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              onChange={handleInputChange}
              value={userFormData.confirmPassword}
              required
            />
            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {formErrors.confirmPassword && <span className="error">{formErrors.confirmPassword}</span>}

          <button type="submit" className="button-primary">
            Inscription
          </button>
        </form>
        <p>
          <Link to="/login">Retour à la page de connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
