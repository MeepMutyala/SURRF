import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';

const DraggableHeader = () => {
  const [headerHeight, setHeaderHeight] = useState(100); // Initial height
  const headerRef = useRef(null);

  const handleDrag = (e, ui) => {
    const newHeight = headerHeight + ui.deltaY;
    setHeaderHeight(Math.max(50, newHeight)); // Minimum height of 50px
  };

  return (
    <Draggable
      axis="y"
      bounds="parent"
      onDrag={handleDrag}
      position={{ x: 0, y: 0 }}
    >
      <div 
        ref={headerRef}
        style={{
          height: `${headerHeight}px`,
          backgroundColor: 'lightblue',
          cursor: 'ns-resize',
          padding: '10px',
          userSelect: 'none'
        }}
      >
      </div>
    </Draggable>
  );
};

export default DraggableHeader;