import React, { useState } from 'react';
import Advertisements from '../component/Advertisements';
import LatestAdvertisements from '../component/LatestAdvertisements';
import SearchBar from '../component/SearchBar';

const AdvertisementsPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (term) => {
    fetch(`http://localhost:5500/rechercher-annonces?term=${term}`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data.annonces))
      .catch((error) => console.error('Erreur de recherche : ' + error));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <LatestAdvertisements allAdvertisements={searchResults} />
      <Advertisements allAdvertisements={searchResults} />
    </div>
  );
};

export default AdvertisementsPage;
