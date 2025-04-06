import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Cookies handle karne ke liye

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");

  // Separate states for Login and Sign Up
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Handle input changes for both forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (activeTab === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        // Login API
        const response = await axios.post("http://localhost:5000/login", loginData);

        // Save Token in Cookies
        Cookies.set("token", response.data.token, { expires: 20, path: "/" });

        alert("Logged in successfully!");
        console.log("Token Saved in Cookie:", response.data.token);

        // Navigate to Profile Page (Optional)
        window.location.href = "/";
      } else {
        // Register API
        const response = await axios.post("http://localhost:5000/register", signUpData);
        alert("Registration successful!");
        console.log(response.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    color: "#f5f5f5",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#1E1E1E",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  };

  const tabsContainerStyle = {
    display: "flex",
    backgroundColor: "#2C2C2C",
    borderBottom: "1px solid #3F3F3F",
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: "12px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "500",
    color: isActive ? "#F5F5F5" : "#9E9E9E",
    borderBottom: isActive ? "2px solid #F5F5F5" : "2px solid transparent",
    transition: "all 0.3s ease",
  });

  const formStyle = {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const inputStyle = {
    padding: "12px",
    backgroundColor: "#2C2C2C",
    color: "#F5F5F5",
    border: "1px solid #3F3F3F",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
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
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Tab Switching */}
        <div style={tabsContainerStyle}>
          <div
            style={tabStyle(activeTab === "login")}
            onClick={() => setActiveTab("login")}
          >
            Login
          </div>
          <div
            style={tabStyle(activeTab === "signup")}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </div>
        </div>

        {/* Form */}
        <form style={formStyle} onSubmit={handleSubmit}>
          {activeTab === "signup" && (
            <input
              type="text"
              name="fullName"
              value={signUpData.fullName}
              placeholder="Full Name"
              style={inputStyle}
              onChange={handleInputChange}
            />
          )}
          <input
            type="email"
            name="email"
            value={activeTab === "login" ? loginData.email : signUpData.email}
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            value={
              activeTab === "login" ? loginData.password : signUpData.password
            }
            placeholder="Password"
            style={inputStyle}
            onChange={handleInputChange}
          />
          <button type="submit" style={buttonStyle}>
            {activeTab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
