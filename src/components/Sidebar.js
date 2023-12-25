import React from 'react';
import DraggableItem from './DraggableItem';

const Sidebar = ({ onDragStart, onExport }) => {
  return (
    <aside className="sidebar">
      <DraggableItem label="Label" onDragStart={(e) => onDragStart(e, "Label")} />
      <DraggableItem label="Input" onDragStart={(e) => onDragStart(e, "Input")} />
      <DraggableItem label="Button" onDragStart={(e) => onDragStart(e, "Button")} />
      <button onClick={onExport}>Export Configuration</button>
    </aside>
  );
};

export default Sidebar;
