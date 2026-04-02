import React, { useState } from "react";
import { createGrievance } from "../services/api";

function CreateGrievance() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [location,    setLocation]    = useState("");
  const [photo,       setPhoto]       = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [success,     setSuccess]     = useState("");
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
    const input = document.getElementById("photo-input");
    if (input) input.value = "";
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation(`https://www.google.com/maps?q=${lat},${lng}`);
      },
      () => alert("Could not get location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!title || !description) { setError("Title and description are required."); return; }
    try {
      setLoading(true);
      const data = await createGrievance(title, description, location, photo);
      if (data.grievance) {
        setSuccess("Grievance submitted successfully!");
        setTitle(""); setDescription(""); setLocation("");
        setPhoto(null); setPreview(null);
        const input = document.getElementById("photo-input");
        if (input) input.value = "";
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.message || "Submission failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1>Create Grievance</h1>
          <p className="text-muted">Submit a new grievance with title, description, and location.</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="grievance-title">Title <span className="required">*</span></label>
          <input id="grievance-title" type="text" placeholder="Brief title for your grievance"
            value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="grievance-description">Description <span className="required">*</span></label>
          <textarea id="grievance-description" placeholder="Describe the issue in detail..."
            value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="grievance-location">Location</label>
          <div className="form-row form-row-location">
            <input id="grievance-location" type="text"
              placeholder="Use Detect Location or type an address"
              value={location} onChange={(e) => setLocation(e.target.value)} />
            <button type="button" onClick={detectLocation} className="btn btn-outline">
              📍 Detect Location
            </button>
          </div>
        </div>

        {/* ── Photo upload — optional ── */}
        <div className="form-group">
          <label>Photo <span className="text-muted">(optional)</span></label>
          <div className="photo-upload-area">
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => document.getElementById("photo-input").click()}
            >
              📷 Choose Image
            </button>
            {photo && <span className="photo-filename">{photo.name}</span>}
          </div>
          <p className="form-hint">JPG, PNG, GIF or WEBP — max 5MB</p>
          {preview && (
            <div className="photo-preview-wrapper">
              <img src={preview} alt="Preview" className="photo-preview" />
              <button
                type="button"
                className="photo-remove-btn"
                onClick={removePhoto}
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-lg" disabled={loading}>
          {loading ? "Submitting…" : "Submit Grievance"}
        </button>

      </form>
    </div>
  );
}

export default CreateGrievance;