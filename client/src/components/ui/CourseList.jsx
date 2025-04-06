import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";

const CourseList = () => {
  const [course_list, setCourse_list] = useState([]); // Initialize as empty array
  const [showAllCourses, setShowAllCourses] = useState(false); // State to control visibility of full list
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    // Fetch Courses from API
    const fetchCourseData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse_list(response.data.courses); // Store courses in state
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Session Expired! Please Login Again.");
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchCourseData();
  }, [navigate]);

  const handleViewMore = () => {
    setShowAllCourses(true); // Show the full list of courses when "View More" is clicked
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Explore Our Courses</h1>

      {/* Course Grid */}
      <div style={styles.courseGrid}>
        {course_list.slice(0, showAllCourses ? course_list.length : 8).map((course) => (
          <CourseCard
            key={course._id}
            image={course.thumbnail || "https://th.bing.com/th/id/OIP.h10Fiiz9i2F5Z6Kf8126GgHaCa?rs=1&pid=ImgDetMain"} // Default image
            name={course.title}
            price={course.Price ? `₹${course.Price}` : "Free"}
            id={course._id}
          />
        ))}
      </div>

      {/* View More Button */}
      {!showAllCourses && course_list.length > 8 && (
        <button style={styles.viewMoreButton} onClick={handleViewMore}>
          View More
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#121212", // Dark background for consistency
    minHeight: "100vh",
    color: "#F5F5F5", // Light text color
    position: "relative",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#F5F5F5", // Light color for the heading
    marginBottom: "20px",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", // Subtle text shadow for better contrast
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "0 20px",
  },
  noCourses: {
    color: "#333333", // Dark Gray for the no courses message
    fontSize: "18px",
  },
  viewMoreButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #00bcd4, #4c51bf)", // Gradient background for the button
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow effect for depth
  },
  viewMoreButtonHover: {
    backgroundColor: "#173146", // Darker shade of Deep Blue on hover
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
};

// Responsive styling for different screen sizes
const responsiveStyles = {
  "@media screen and (max-width: 768px)": {
    courseGrid: {
      gridTemplateColumns: "repeat(3, 1fr)", // 3 courses on mobile
    },
    viewMoreButton: {
      padding: "10px 20px",
      fontSize: "16px",
    },
  },
  "@media screen and (min-width: 769px)": {
    courseGrid: {
      gridTemplateColumns: "repeat(4, 1fr)", // Up to 8 courses on desktop
    },
  },
};

export default CourseList;
