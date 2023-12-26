// Importing necessary dependencies and components
import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import EditableArea from "./components/EditableArea";

// Main App component
function App() {
  // State variables
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    if (item.id) {
      // Handling drag start for existing items
      const currentItemIndex = items.findIndex((i) => i.id === item.id);
      setCurrentElement(items[currentItemIndex]);
      e.dataTransfer.setData("application/reactflow", item.id);
      e.dataTransfer.effectAllowed = "move";
    } else {
      // Handling drag start for new items
      const rect = e.target.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setData("text/plain", item);
      e.dataTransfer.setData(
        "offset",
        JSON.stringify({ x: offsetX, y: offsetY })
      );
    }
  };

  const handleDragOver = (e) => {
    // Preventing default behavior to allow dropping
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    // Handling item drop
    e.preventDefault();
    const id = e.dataTransfer.getData("application/reactflow");

    if (id) {
      // Moving existing item within the area
      const currentItem = items.find((item) => item.id.toString() === id);
      if (currentItem) {
        setCurrentElement(currentItem);
      }
    } else {
      // Dropping a new item onto the area
      const label = e.dataTransfer.getData("text");
      const offset = JSON.parse(e.dataTransfer.getData("offset"));
      const dropAreaRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - dropAreaRect.left - offset.x;
      const y = e.clientY - dropAreaRect.top - offset.y;
      const newItem = {
        id: Math.random(),
        label,
        x,
        y,
        fontSize: "16",
        fontWeight: "400",
      };
      setItems([...items, newItem]);
    }
  };

  // Handling changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (currentElement) {
      setCurrentElement((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Saving changes made to the current item
  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (!currentElement) return;

    setItems(
      items.map((item) =>
        item.id === currentElement.id ? { ...item, ...currentElement } : item
      )
    );
    setIsModalOpen(false);
  };

  // Handling drag end to update item position
  const handleDragEnd = (e) => {
    if (!currentElement) return;

    const dropAreaRect = document
      .querySelector(".drop-area")
      .getBoundingClientRect();
    const newX = e.clientX - dropAreaRect.left;
    const newY = e.clientY - dropAreaRect.top;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === currentElement.id) {
          return { ...item, x: newX, y: newY };
        }
        return item;
      })
    );

    setCurrentElement(null);
  };

  // Handling click on an existing item
  const handleElementClick = (item, e) => {
    e.stopPropagation();
    setCurrentElement(item);
    setSelectedItemId(item.id);
    setIsModalOpen(true);
  };

  // Loading items from local storage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Saving items to local storage on items change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Saving current element and selected item ID to local storage
  useEffect(() => {
    if (currentElement) {
      localStorage.setItem("currentElement", JSON.stringify(currentElement));
    }
    if (selectedItemId) {
      localStorage.setItem("selectedItemId", JSON.stringify(selectedItemId));
    }
  }, [currentElement, selectedItemId]);

  // Handling deletion of the current item
  const handleDeleteElement = () => {
    if (!currentElement) return;

    setItems(items.filter((item) => item.id !== currentElement.id));
    setCurrentElement(null);
    setSelectedItemId(null);
    setIsModalOpen(false);
  };

  // Exporting items to JSON file
  const exportToJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(items));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "page_configuration.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="app">
      {/* Editable area for dragging and dropping items */}
      <EditableArea
        items={items}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onElementClick={handleElementClick}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />

      {/* Modal for editing item properties */}
      <Modal
        isOpen={isModalOpen}
        currentElement={currentElement}
        onClose={() => setIsModalOpen(false)}
        onSaveChanges={handleSaveChanges}
        onDeleteElement={handleDeleteElement}
        handleChange={handleChange}
      />

      {/* Sidebar for additional actions */}
      <Sidebar onDragStart={handleDragStart} onExport={exportToJson} />
    </div>
  );
}

export default App;
