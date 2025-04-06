import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    subTitle: "",
    description: "",
    category: "",
    courseLvel: "",
    Price: "",
    thumbnail: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");

    // ✅ Fetch existing course data
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourse(response.data.updatedCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
        alert("Failed to load course data!");
      }
    };

    fetchCourse();
  }, [id]);

  // ✅ Handle form changes
  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  // ✅ Submit form to update course using API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      await axios.put(`http://localhost:5000/courses/${id}`, course, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Course updated successfully!");
      navigate("/courses"); // Redirect after success
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Background effects */}
      <div style={styles.gridLines}></div>
      <div style={styles.pulse1}></div>
      <div style={styles.pulse2}></div>
      <div style={styles.hexPattern}></div>

      {/* Card with form */}
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Course</h2>
        <div style={styles.separator}></div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="subTitle"
            value={course.subTitle}
            onChange={handleChange}
            placeholder="Sub Title"
            style={styles.input}
          />
          
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="Description"
            style={styles.textarea}
          ></textarea>
          
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            placeholder="Category"
            style={styles.input}
            required
          />
          
          <select
            name="courseLvel"
            value={course.courseLvel}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>
          
          <input
            type="number"
            name="Price"
            value={course.Price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
          />
          
          <input
            type="text"
            name="thumbnail"
            value={course.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            style={styles.input}
          />
          
          <button type="submit" style={styles.button}>Update Course</button>
        </form>
      </div>
    </div>
  );
};

// ✅ In-Document CSS for Modern Styling with animations
const styles = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#000", // Black background for the entire container
    padding: "20px",
    overflow: "hidden",
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(to right, #2a4365 1px, transparent 1px), linear-gradient(to bottom, #2a4365 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.2,
  },
  pulse1: {
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
  },
  pulse2: {
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
  },
  hexPattern: {
    position: "absolute",
    top: "10%",
    right: "10%",
    width: "96px",
    height: "96px",
    background: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z\' stroke=\'%23405071\' fill=\'none\' stroke-width=\'1\'/%3E%3C/svg%3E')",
    opacity: 0.05,
    animation: "pulseHex 3s infinite",
  },
  card: {
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
  },
  title: {
    marginBottom: "15px", // Reduced margin to make it more compact
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #00bcd4, #6a11cb)", // Cyan to Purple gradient
    "-webkit-background-clip": "text",
    color: "transparent",
    animation: "gradientAnimation 4s linear infinite",
  },
  separator: {
    height: "1px",
    width: "40px",
    background: "linear-gradient(to right, #00bcd4, #6a11cb)", // Gradient line below title
    margin: "5px auto", // Reduced margin for compactness
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px", // Reduced gap between form elements
  },
  input: {
    padding: "10px", // Reduced padding for a more compact input
    borderRadius: "6px",
    border: "1px solid #00bcd4",
    backgroundColor: "#1f2937",
    color: "#fff",
    fontSize: "14px", // Reduced font size for compactness
    marginBottom: "8px", // Reduced bottom margin for compactness
    outline: "none",
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "10px", // Reduced padding for a more compact textarea
    borderRadius: "6px",
    border: "1px solid #00bcd4",
    backgroundColor: "#1f2937",
    color: "#fff",
    fontSize: "14px", // Reduced font size for compactness
    height: "70px", // Reduced height for the textarea
    resize: "none",
    marginBottom: "8px", // Reduced bottom margin for compactness
    outline: "none",
    transition: "all 0.3s ease",
  },
  select: {
    padding: "10px", // Reduced padding for a more compact select
    borderRadius: "6px",
    border: "1px solid #00bcd4",
    backgroundColor: "#1f2937",
    color: "#fff",
    fontSize: "14px", // Reduced font size for compactness
    marginBottom: "8px", // Reduced bottom margin for compactness
    outline: "none",
    transition: "all 0.3s ease",
  },
  button: {
    background: "linear-gradient(to right, #00bcd4, #6a11cb)", // Cyan to Purple gradient for button
    color: "#fff",
    padding: "12px", // Reduced padding for a more compact button
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default EditCourse;
