import React, { useState, useEffect, useRef } from 'react';
import { IoMdSearch } from 'react-icons/io';
import Fuse from 'fuse.js'; // Import Fuse.js
import './Search.css';
import { Link } from 'react-router-dom';

export default function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;

    // Use Fuse.js to get search results
    const fuse = new Fuse(searchData, {
      keys: ['title', 'content', 'link'],
      threshold: 0.3,
    });
    const results = fuse.search(searchTerm);

    setSearchResults(results);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    // Simulate loading data from an external source
    const fetchData = async () => {
      // Example data with 'title' and 'content'
      const data = [
        { title: 'Sports Athletics', content: 'Information about sports and athletics', link: '/sports/athletics'  },
      ];

      setSearchData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <div onClick={handleSearchIconClick}>
        <IoMdSearch />
      </div>

      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
            <ul>
            {searchResults.map((result) => (
              <li key={result.item.title}>
                <p><Link to={result.item.link}><strong>{result.item.title}</strong></Link></p>
              </li>
            ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
