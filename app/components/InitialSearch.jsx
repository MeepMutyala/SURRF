import React, { useState } from 'react';

const InitialSearch = ({ onSearch }) => {
  const [searchTopic, setSearchTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      onSearch(searchTopic);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/2">
        <input 
          type="text" 
          value={searchTopic} 
          onChange={(e) => setSearchTopic(e.target.value)} 
          placeholder="Enter a topic to start" 
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Start</button>
      </form>
    </div>
  );
};

export default InitialSearch;