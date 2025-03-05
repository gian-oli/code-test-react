import React, { useState } from 'react';
import './SearchBox.scss'; // Correct import if both files are in the same directory

const SearchBox = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="search-box">
            <input
                type="text"
                placeholder="Search launches..."
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBox;