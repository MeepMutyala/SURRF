import React from 'react';

const SidePanel = ({ isOpen, onClose, children }) => {
  return (
    <div className={`side-panel ${isOpen ? 'open' : ''}`}>
      <button className="close-panel" onClick={onClose}>×</button>
      {children}
    </div>
  );
};

export default SidePanel;