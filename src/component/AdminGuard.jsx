import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminGuard = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userId = Cookies.get('userId');

    if (userId) {
      fetch('http://localhost:5500/getRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUserRole(data.role);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du rôle :', error);
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (userRole === 'admin') {
    return <>{children}</>;
  } else {
    navigate('/');
    return null;
  }
};

export default AdminGuard;