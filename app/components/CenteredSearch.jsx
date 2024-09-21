import React from 'react';

const CenteredSearch = ({ onSubmit, searchTopic, setSearchTopic }) => (
  <div className="flex items-center justify-center h-screen">
    <form onSubmit={onSubmit} className="w-2/3">
      <input
        type="text"
        value={searchTopic}
        onChange={(e) => setSearchTopic(e.target.value)}
        placeholder="Enter a topic to start"
        className="w-full p-4 text-xl border-2 rounded-lg"
      />
      <button type="submit" className="mt-4 w-full p-4 bg-blue-500 text-white rounded-lg text-xl">
        Start Surfing
      </button>
    </form>
  </div>
);

export default CenteredSearch;