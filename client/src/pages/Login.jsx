import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (activeTab === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === "login") {
        if (!loginData.email || !loginData.password) {
          alert("Please fill in all fields");
          setLoading(false);
          return;
        }

        const response = await axios.post("https://codeup-ql59.onrender.com/login", loginData);

        if (response.data.success) {
          Cookies.set("token", response.data.token, { expires: 1, path: "/" });
          window.location.href = "/";
        }
      } else {
        if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
          alert("Please fill in all fields");
          setLoading(false);
          return;
        }

        if (signUpData.password.length < 6) {
          alert("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const response = await axios.post("https://codeup-ql59.onrender.com/register", signUpData);
        
        if (response.data.success) {
          alert("Registration successful! Please login.");
          setActiveTab("login");
          setSignUpData({ fullName: "", email: "", password: "" });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.brandContainer}>
          <h1 style={styles.brandTitle}>Welcome to CodeUP</h1>
          <p style={styles.brandSubtitle}>
            Join thousands of learners advancing their careers with expert-led courses
          </p>
        </div>
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>✓</div>
            <div>
              <h3 style={styles.featureTitle}>Expert Instructors</h3>
              <p style={styles.featureText}>Learn from industry professionals</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>✓</div>
            <div>
              <h3 style={styles.featureTitle}>Flexible Learning</h3>
              <p style={styles.featureText}>Study at your own pace</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>✓</div>
            <div>
              <h3 style={styles.featureTitle}>Certificates</h3>
              <p style={styles.featureText}>Earn recognized credentials</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.card}>
          <div style={styles.tabs}>
            <button
              style={{...styles.tab, ...(activeTab === "login" && styles.tabActive)}}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>
            <button
              style={{...styles.tab, ...(activeTab === "signup" && styles.tabActive)}}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            {activeTab === "signup" && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={20} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="fullName"
                    value={signUpData.fullName}
                    placeholder="John Doe"
                    style={styles.input}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={activeTab === "login" ? loginData.email : signUpData.email}
                  placeholder="you@example.com"
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={activeTab === "login" ? loginData.password : signUpData.password}
                  placeholder="••••••••"
                  style={styles.input}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? (
                <div style={styles.spinner}></div>
              ) : (
                activeTab === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    background: '#f8fafc',
  },
  leftSection: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    padding: '4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
  },
  brandContainer: {
    marginBottom: '4rem',
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  brandSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    lineHeight: '1.6',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  feature: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  featureText: {
    opacity: 0.9,
    fontSize: '0.875rem',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  tabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    marginBottom: '2rem',
    background: '#f1f5f9',
    padding: '0.25rem',
    borderRadius: '0.75rem',
  },
  tab: {
    padding: '0.75rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'white',
    color: '#6366f1',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#94a3b8',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  eyeButton: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: 0,
  },
  submitButton: {
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
  },
};

export default Login;
