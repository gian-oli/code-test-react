import React, { useState } from "react";
import "./App.scss";
import { Launches } from "./components/Launch/Launch";
import SearchBox from "./components/SearchBox/SearchBox";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>SpaceX Launches</h3>
        <SearchBox onSearch={handleSearch} />
      </header>
      <Launches searchTerm={searchTerm} />
      <footer className="App-footer">
        gian-oli
      </footer>
    </div>
  );
}

export default App;
