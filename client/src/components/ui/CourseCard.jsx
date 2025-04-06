import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ id, image, name, price }) => {
  const styles = {
    card: {
      background: "#1E2A47",
      color: "#fff",
      borderRadius: "10px",
      padding: "15px",
      textAlign: "center",
      width: "280px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
      transition: "transform 0.3s ease",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      borderRadius: "8px",
    },
    name: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "10px",
    },
    price: {
      fontSize: "18px",
      color: "#4caf50",
      fontWeight: "bold",
      margin: "8px 0",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#4caf50",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      textDecoration: "none",
      display: "inline-block",
    },
  };

  return (
    <div style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <h2 style={styles.name}>{name}</h2>
      <p style={styles.price}>₹{price}</p>
      <Link to={`/course/${id}`} style={styles.button}>View Course</Link>
    </div>
  );
};

export default CourseCard;
