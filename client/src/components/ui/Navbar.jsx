import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role === "admin");
        console.log(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login"; // Redirect after logout
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoText}>
          Code<span style={styles.logoHighlight}>UP</span>
        </span>
        <div style={styles.logoUnderline}></div>
      </Link>
      <div style={styles.rightSection}>
        {!token ? (
          <Link to="/login">
            <button style={styles.getStartedBtn}>Get Started</button>
          </Link>
        ) : (
          <div>
            <img
              src="https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain"
              alt="👤"
              style={styles.profileImage}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div style={styles.dropdownMenu}>
                <Link to="/profile" style={styles.dropdownItem}>Account</Link>
                <Link to="/my-learning" style={styles.dropdownItem}>My Learning</Link>
                {userRole ? (
                  <Link to="/admin" style={styles.dropdownItem}>Admin</Link>
                ) : (
                  <Link to="/my-courses" style={styles.dropdownItem}>My Courses</Link>
                )}
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    backgroundColor: "#0F1924", // Deep Blue
    color: "#F1F1F1",
    position: "sticky",
    top: "0",
    zIndex: "1000",
    boxShadow: "none",
    transition: "all 0.3s ease",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "transparent",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  logoText: {
    background: "linear-gradient(to right, #9b4d96, #4d96b4)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  logoHighlight: {
    color: "#4d96b4", // Teal for "UP" part
  },
  logoUnderline: {
    position: "absolute",
    bottom: "-1px",
    left: "0",
    width: "0%",
    height: "2px",
    background: "linear-gradient(to right, #9b4d96, #4d96b4)",
    transition: "width 0.3s ease",
  },
  logoHover: {
    width: "100%",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  getStartedBtn: {
    padding: "10px 18px",
    backgroundColor: "#9b4d96", // Purple
    color: "#FFF",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  getStartedBtnHover: {
    backgroundColor: "#7a3f7f", // Darker Purple on Hover
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid #4CAF50", // Green Border
  },
  dropdownMenu: {
    position: "absolute",
    top: "70px",
    right: "30px",
    backgroundColor: "#0F1924", // Deep Blue
    color: "#F1F1F1",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    zIndex: "1000",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  dropdownItem: {
    padding: "10px 15px",
    color: "#F1F1F1",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#81D4FA", // Soft Blue on hover
  },
  logoutBtn: {
    padding: "10px 15px",
    color: "#F1F1F1",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    marginTop: "10px",
  },
};

export default Navbar;
