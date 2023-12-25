import React from "react";

function DropArea({ onDrop, onDragOver, onClick, children }) {
  return (
    <div
      className="drop-area"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default DropArea;
