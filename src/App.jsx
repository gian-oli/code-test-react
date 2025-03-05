import React, { useState } from 'react';
import './App.css'; // Import the SCSS file
import { Launches } from './components/Launch/Launch';
import SearchBox from './components/SearchBox/SearchBox';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="App">
      <h1>SpaceX Launches</h1>
      <SearchBox onSearch={handleSearch} />
      <Launches searchTerm={searchTerm} />
    </div>
  );
}

export default App;