import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchAdminCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching admin courses:", error);
        alert("Session Expired! Please Login Again.");
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchAdminCourses();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <h3 style={styles.subtitle}>All Created Courses</h3>

        {courses.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Level</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} style={styles.tr}>
                  <td style={styles.td}>{course.title}</td>
                  <td style={styles.td}>{course.category}</td>
                  <td style={styles.td}>{course.courseLvel}</td>
                  <td style={styles.td}>{course.Price ? `₹${course.Price}` : "Free"}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                    >
                      ✏️ Edit
                    </button>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => navigate(`/add-lecture/${course._id}`)}
                    >
                      Add Lecture
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noData}>No courses have been created yet.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Updated Styles: Darker Text & Increased Cell Height
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "85%",
    textAlign: "center",
  },
  title: {
    marginBottom: "10px",
    color: "#000", // Changed to black
  },
  subtitle: {
    marginBottom: "20px",
    color: "#000", // Changed to black
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#4CAF50",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },
  tr: {
    height: "50px", // Increased row height
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    color: "#000", // Changed to black
  },
  noData: {
    color: "red",
    fontWeight: "bold",
  },
  button: {
    background: "#4CAF50",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default AdminDashboard;
