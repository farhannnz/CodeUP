import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const AddLecture = () => {
  const { Courseid } = useParams(); // Get the courseId from the URL
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Debugging Courseid
  console.log("Course ID:", Courseid);

  const token = Cookies.get("token") || localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!lectureTitle || !videoUrl) {
      setError("Both lecture title and video URL are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/add-lecture/${Courseid}`, // Use Courseid in the URL
        { lectureTitle, videoUrl },
        {
          headers: {
            "Content-Type": "application/json",  
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setLectureTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to add lecture. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Add New Lecture</h3>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Lecture Title</label>
          <input
            type="text"
            placeholder="Enter lecture title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Video URL</label>
          <input
            type="url"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Add Lecture
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#121212", // Dark background for the page
    color: "#f5f5f5", // Light text color
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#f5f5f5",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#1E1E1E", // Dark background for the form
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "500px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#f5f5f5",
  },
  input: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2C2C2C", // Dark input background
    color: "#f5f5f5",
    border: "1px solid #3F3F3F",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #444, #222)",
    color: "#f5f5f5",
    fontSize: "16px",
    fontWeight: "600",
    border: "1px solid #3F3F3F",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s ease",
  },
  successMessage: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center",
  },
  errorMessage: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default AddLecture;
