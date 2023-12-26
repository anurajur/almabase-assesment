import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import EditableArea from "./components/EditableArea";

function App() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDragStart = (e, item) => {
    if (item.id) {
      
      const currentItemIndex = items.findIndex((i) => i.id === item.id);
      setCurrentElement(items[currentItemIndex]);
      e.dataTransfer.setData("application/reactflow", item.id); 
      e.dataTransfer.effectAllowed = "move";
    } else {
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
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("application/reactflow");

    if (id) {
      const currentItem = items.find((item) => item.id.toString() === id);
      if (currentItem) {
        setCurrentElement(currentItem);
       
      }
    } else {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (currentElement) {
      setCurrentElement((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleElementClick = (item, e) => {
    e.stopPropagation(); 
    setCurrentElement(item);
    setSelectedItemId(item.id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (currentElement) {
      localStorage.setItem("currentElement", JSON.stringify(currentElement));
    }
    if (selectedItemId) {
      localStorage.setItem("selectedItemId", JSON.stringify(selectedItemId));
    }
  }, [currentElement, selectedItemId]);

  const handleDeleteElement = () => {
    if (!currentElement) return;

    setItems(items.filter((item) => item.id !== currentElement.id));
    setCurrentElement(null);
    setSelectedItemId(null);
    setIsModalOpen(false);
  };

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
      <Modal
        isOpen={isModalOpen}
        currentElement={currentElement}
        onClose={() => setIsModalOpen(false)}
        onSaveChanges={handleSaveChanges}
        onDeleteElement={handleDeleteElement}
        handleChange={handleChange}
      />
      <Sidebar onDragStart={handleDragStart} onExport={exportToJson} />
    </div>
  );
}

export default App;
