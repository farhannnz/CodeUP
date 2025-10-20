import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Menu, X, User, BookOpen, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userName, setUserName] = useState("");
  const token = Cookies.get("token");
  const location = useLocation();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role === "admin");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <GraduationCap size={32} style={{ color: '#6366f1' }} />
          <span style={styles.logoText}>CodeUP</span>
        </Link>

        {/* Desktop Navigation */}
        <div style={styles.desktopNav}>
          {token && (
            <>
              <Link 
                to="/" 
                style={{...styles.navLink, ...(isActive('/') && styles.navLinkActive)}}
              >
                Courses
              </Link>
              <Link 
                to="/my-learning" 
                style={{...styles.navLink, ...(isActive('/my-learning') && styles.navLinkActive)}}
              >
                My Learning
              </Link>
            </>
          )}
        </div>

        <div style={styles.rightSection}>
          {!token ? (
            <Link to="/login">
              <button style={styles.loginBtn}>
                Sign In
              </button>
            </Link>
          ) : (
            <div style={styles.profileContainer}>
              <button
                style={styles.profileButton}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div style={styles.avatar}>
                  <User size={20} />
                </div>
              </button>

              {showDropdown && (
                <div style={styles.dropdown}>
                  <Link to="/profile" style={styles.dropdownItem}>
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link to="/my-learning" style={styles.dropdownItem}>
                    <BookOpen size={18} />
                    <span>My Learning</span>
                  </Link>
                  {userRole && (
                    <Link to="/admin" style={styles.dropdownItem}>
                      <LayoutDashboard size={18} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <div style={styles.divider}></div>
                  <button style={styles.dropdownItem} onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuBtn}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div style={styles.mobileMenu}>
          {token && (
            <>
              <Link to="/" style={styles.mobileLink}>Courses</Link>
              <Link to="/my-learning" style={styles.mobileLink}>My Learning</Link>
              <Link to="/profile" style={styles.mobileLink}>Profile</Link>
              {userRole && (
                <Link to="/admin" style={styles.mobileLink}>Admin Dashboard</Link>
              )}
              <button style={styles.mobileLinkBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    fontWeight: '800',
    fontSize: '1.5rem',
  },
  logoText: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  desktopNav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    fontSize: '0.875rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    color: '#6366f1',
    background: 'rgba(99, 102, 241, 0.1)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  loginBtn: {
    padding: '0.625rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'all 0.2s ease',
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: 0,
    background: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#334155',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '0.5rem 0',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#334155',
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    padding: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  mobileLink: {
    padding: '0.75rem 1rem',
    color: '#334155',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  mobileLinkBtn: {
    padding: '0.75rem 1rem',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
};

// Media query styles
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  styles.desktopNav.display = 'none';
  styles.mobileMenuBtn.display = 'block';
  styles.mobileMenu.display = 'flex';
}

export default Navbar;
