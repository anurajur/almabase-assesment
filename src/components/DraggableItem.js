import React from "react";

function DraggableItem({ label, onDragStart }) {
  return (
    <div className="draggable" draggable onDragStart={onDragStart}>
      {label}
    </div>
  );
}

export default DraggableItem;
