import React, { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for "${searchQuery}"`); // Replace with actual search logic
    }
  };

  const styles = {
    hero: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      height: "100vh", // Full viewport height
      padding: "20px",
      color: "#f1f1f1", // Text color
      background: "black", // Background color
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      width: "100%",
    },
    gridLines: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "linear-gradient(to right, #2a4365 1px, transparent 1px), linear-gradient(to bottom, #2a4365 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      opacity: "0.3",
    },
    hexPattern: {
      position: "absolute",
      top: "25%",
      right: "25%",
      width: "96px",
      height: "96px",
      background: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z\' stroke=\'%23405071\' fill=\'none\' stroke-width=\'1\'/%3E%3C/svg%3E')",
      opacity: 0.05,
      animation: "pulseHex 3s infinite",
    },
    pulse1: {
      position: "absolute",
      top: "25%",
      right: "25%",
      width: "256px",
      height: "256px",
      borderRadius: "50%",
      backgroundColor: "#00bcd4", // Cyan
      filter: "blur(80px)",
      opacity: 0.2,
      animation: "pulse 5s ease-in-out infinite",
    },
    pulse2: {
      position: "absolute",
      bottom: "25%",
      left: "25%",
      width: "384px",
      height: "384px",
      borderRadius: "50%",
      backgroundColor: "#4c51bf", // Indigo
      filter: "blur(80px)",
      opacity: 0.1,
      animation: "pulse 5s ease-in-out infinite",
    },
    tagline: {
      fontSize: "clamp(24px, 4vw, 36px)", // Responsive font size
      fontWeight: "bold",
      marginBottom: "20px",
      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.7)",
      background: "linear-gradient(90deg, #00bcd4, #6a11cb)", // Cyan to Purple
      "-webkit-background-clip": "text",
      color: "transparent",
      animation: "gradientAnimation 4s linear infinite",
    },
    subtitle: {
      fontSize: "clamp(14px, 2vw, 18px)", // Responsive font size
      marginBottom: "30px",
      color: "#cccccc", // Lighter text for the subtitle
      maxWidth: "80%",
    },
    searchContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    searchInput: {
      padding: "10px 15px",
      border: "1px solid #00bcd4", // Border in cyan
      borderRadius: "6px",
      width: "clamp(200px, 40%, 400px)", // Responsive width
      outline: "none",
      fontSize: "16px",
      fontFamily: "'Poppins', sans-serif",
      color: "#f1f1f1", // Light text inside the input
      background: "#1f2937", // Dark background
      backdropFilter: "blur(10px)",
    },
    searchButton: {
      padding: "10px 20px",
      backgroundColor: "#00bcd4",  // Cyan color for the button
      color: "#ffffff",  // White text
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: "'Poppins', sans-serif",
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    searchButtonHovered: {
      transform: "scale(1.05)",
    },
  };

  return (
    <section style={styles.hero}>
      <div style={styles.gridLines}></div>
      <div style={styles.pulse1}></div>
      <div style={styles.pulse2}></div>
      <div style={styles.hexPattern}></div>

      <h1 style={styles.tagline}>Unlock Your Potential</h1>
      <p style={styles.subtitle}>Explore, learn, and excel with our next-generation curated courses for the future.</p>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          aria-label="Search for courses"
        />
        <button
          style={{
            ...styles.searchButton,
            transform: searchQuery ? "scale(1.05)" : "scale(1)",
          }}
          onClick={handleSearch}
          aria-label="Search button"
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default Hero;
