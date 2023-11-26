import React from 'react';
import AdminAnnonce from '../component/AdminAnnonce';
import AdminEntreprise from '../component/AdminEntreprise';
import AdminCandidSpont from '../component/AdminCandidSpont';
import AdminUtilisateur from '../component/AdminUtilisateur';
import '../style/BackOffice.css';

const BackOfficePage = () => {
  return (
    <div className="div-backoffice">
      <AdminUtilisateur />
      <AdminAnnonce />
      <AdminEntreprise />
      <AdminCandidSpont />
    </div>
  );
};

export default BackOfficePage;