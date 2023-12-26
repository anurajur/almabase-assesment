import React from "react";

//Modal component for editing properties of a selected element.
const Modal = ({
  isOpen,
  currentElement,
  onClose,
  onSaveChanges,
  onDeleteElement,
  handleChange,
}) => {

  // If the modal is closed or no current element is selected, return null
  if (!isOpen || !currentElement) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={onSaveChanges} className="modal-form">
          <h2>Edit Label</h2>
          <div className="form-group">
            <label>Text</label>
            <input
              type="text"
              name="label"
              value={currentElement.label}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>X</label>
            <input type="number" name="x" value={currentElement.x} readOnly />
          </div>
          <div className="form-group">
            <label>Y</label>
            <input type="number" name="y" value={currentElement.y} readOnly />
          </div>
          <div className="form-group">
            <label>Font Size</label>
            <input
              type="number"
              name="fontSize"
              value={currentElement.fontSize}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Font Weight</label>
            <input
              type="number"
              name="fontWeight"
              value={currentElement.fontWeight}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={onDeleteElement}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
