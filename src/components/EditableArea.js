import React from 'react';
import DropArea from './DropArea';

//EditableArea component represents an area where items can be dragged and dropped.

const EditableArea = ({ items, onDrop, onDragOver, onDragStart, onDragEnd, onElementClick, selectedItemId, setSelectedItemId }) => {
  return (
    <DropArea onDrop={onDrop} onDragOver={onDragOver} onClick={() => setSelectedItemId(null)}>
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => onDragStart(e, item)}
          onDragEnd={onDragEnd}
          className={`dropped-item ${selectedItemId === item.id ? "selected" : ""}`}
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            fontSize: `${item.fontSize}px`,
            fontWeight: item.fontWeight,
            position: "absolute",
            border: selectedItemId === item.id ? "2px solid red" : "none",
          }}
          onClick={(e) => onElementClick(item, e)}
        >
          {item.label}
        </div>
      ))}
    </DropArea>
  );
};

export default EditableArea;
