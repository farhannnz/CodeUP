import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setError("Unauthorized. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/create-course",
        { title, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setTitle("");
      setCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Styles (same as previous component for consistency)
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    color: "#f5f5f5",
    position: "relative",
  };

  const gridLines = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage:
      "linear-gradient(to right, #2a4365 1px, transparent 1px), linear-gradient(to bottom, #2a4365 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.2,
  };

  const pulse1 = {
    position: "absolute",
    top: "25%",
    right: "25%",
    width: "256px",
    height: "256px",
    borderRadius: "50%",
    backgroundColor: "#00bcd4", // Cyan color
    filter: "blur(80px)",
    opacity: 0.1,
    animation: "pulse 5s ease-in-out infinite",
  };

  const pulse2 = {
    position: "absolute",
    bottom: "25%",
    left: "25%",
    width: "384px",
    height: "384px",
    borderRadius: "50%",
    backgroundColor: "#4c51bf", // Indigo color
    filter: "blur(80px)",
    opacity: 0.1,
    animation: "pulse 5s ease-in-out infinite",
  };

  const cardStyle = {
    position: "relative",
    zIndex: 10,
    background: "#1f2937", // Dark background for card
    padding: "20px", // Reduced padding for a more compact card
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    width: "400px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid #00bcd4",
  };

  const headingStyle = {
    marginBottom: "15px", // Reduced margin to make it more compact
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #00bcd4, #6a11cb)", // Cyan to Purple gradient
    "-webkit-background-clip": "text",
    color: "transparent",
  };

  const inputStyle = {
    padding: "10px", // Reduced padding for a more compact input
    backgroundColor: "#2C2C2C",
    color: "#F5F5F5",
    border: "1px solid #3F3F3F",
    borderRadius: "8px",
    fontSize: "16px",
    width: "90%",
    outline: "none",
    marginBottom: "10px",
    transition: "border-color 0.3s ease",
  };

  const buttonStyle = {
    padding: "12px",
    background: "linear-gradient(135deg, #444, #222)",
    color: "#F5F5F5",
    fontSize: "16px",
    fontWeight: "600",
    border: "1px solid #3F3F3F",
    borderRadius: "8px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      <div style={gridLines}></div>
      <div style={pulse1}></div>
      <div style={pulse2}></div>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Create Course</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Course Title"
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category"
            style={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button type="submit" style={buttonStyle}>
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
