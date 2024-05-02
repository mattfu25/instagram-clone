import React, { useState } from 'react';
import axios from 'axios';

function Searchbar({ setUsername }) {
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`/api/user/search?query=${input}`);
        setSearchResults(response.data); 
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleResultClick = (username) => {
    setUsername(username);
  };

  return (
    <div className="fixed top-0 left-16 h-full w-64 m-0 flex flex-col bg-white text-gray-800 shadow-lg">
      <input
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleSearch}
        className="p-2 border rounded"
      />
      <ul>
        {searchResults.map((user) => (
          <li
            key={user.username}
            className="flex items-center space-x-4 p-2 cursor-pointer"
            onClick={() => handleResultClick(user.username)}
          >
            <img
              src={`/api/user/profile-pictures/${user.profilePicture}`}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{user.username}</p>
              <p>{`${user.firstName} ${user.lastName}`}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Searchbar;
