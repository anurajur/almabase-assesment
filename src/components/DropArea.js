import React from "react";

//DropArea component represents a draggable area where items can be dropped.
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
