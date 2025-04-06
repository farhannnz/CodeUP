import React from "react";
import CourseCard from "./CourseCard";
import axios from "axios";




const MyLearning = () => {

 
  // Static purchased courses for now
  const purchasedCourses = [
    {
      id: 1,
      image: "https://source.unsplash.com/300x200/?javascript",
      name: "JavaScript Mastery",
      price: "Purchased",
    },
    {
      id: 2,
      image: "https://source.unsplash.com/300x200/?ai",
      name: "AI & Deep Learning",
      price: "Purchased",
    },
    {
      id: 3,
      image: "https://source.unsplash.com/300x200/?ux",
      name: "UI/UX Design Bootcamp",
      price: "Purchased",
    },
    {
      id: 4,
      image: "https://source.unsplash.com/300x200/?sql",
      name: "SQL & Database Management",
      price: "Purchased",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Learning</h1>

      {/* Purchased Course Grid */}
      <div style={styles.courseGrid}>
        {purchasedCourses.map((course) => (
          <CourseCard
            key={course.id}
            image={course.image}
            name={course.name}
            price={course.price} // Showing "Purchased" instead of actual price
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#121212", // Dark theme
    minHeight: "100vh",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
};

export default MyLearning;
