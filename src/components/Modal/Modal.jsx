import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";

const Modal = ({ onClose, onSubmit, postDetails }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (postDetails) {
      setTitle(postDetails.title);
      setDescription(postDetails.description);
      setMedia(null); // Reset media for editing
    } else {
      setTitle("");
      setDescription("");
      setMedia(null); // Reset for new post
    }
  }, [postDetails]);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || (!media && !postDetails)) {
      alert("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (media) formData.append("media", media);

    try {
      if (postDetails) {
        // Edit existing post
        await axios.put(`http://localhost:5050/VSAPI/V1/posts/${postDetails._id}`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new post
        await axios.post("http://localhost:5050/VSAPI/V1/posts/upload", formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{postDetails ? "Edit Post" : "Create Post"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Title">Title:</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Description">Description:</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="File">Select File:</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{postDetails ? "Update" : "Submit"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
