import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { User, Mail, Camera, Edit2, Save, X, BookOpen, Award, Clock } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    photo_url: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentToken = Cookies.get("token");

      if (!currentToken) {
        alert("Login First!");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://codeup-ql59.onrender.com/profile", {
          headers: { Authorization: `Bearer ${currentToken}` },
        });

        console.log("Profile data:", response.data);
        console.log("Enrolled courses IDs:", response.data.enrolledCourses);

        setUser(response.data);
        setEditFormData({
          fullName: response.data.fullName,
          email: response.data.email,
          photo_url: response.data.photo_url || "",
        });

        if (response.data.enrolledCourses && response.data.enrolledCourses.length > 0) {
          const coursesData = await fetchCoursesData(response.data.enrolledCourses, currentToken);
          console.log("Fetched courses:", coursesData);
          setEnrolledCourses(coursesData);
        } else {
          console.log("No enrolled courses found");
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Session Expired! Please Login Again.");
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchCoursesData = async (courseIds, authToken) => {
    if (!courseIds || courseIds.length === 0) {
      return [];
    }

    try {
      const coursePromises = courseIds.map((courseId) =>
        axios.get(`https://codeup-ql59.onrender.com/course/${courseId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(err => {
          console.error(`Error fetching course ${courseId}:`, err);
          return null;
        })
      );

      const courseResponses = await Promise.all(coursePromises);
      const validCourses = courseResponses
        .filter(response => response && response.data)
        .map((response) => response.data);

      console.log("Valid courses fetched:", validCourses);
      return validCourses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      photo_url: user.photo_url || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "https://codeup-ql59.onrender.com/edit-profile",
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Profile</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatarSection}>
              <div style={styles.avatarContainer}>
                <img
                  src={user.photo_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&size=200&background=667eea&color=fff"}
                  alt="Profile"
                  style={styles.avatar}
                />
                <div style={styles.statusDot}></div>
              </div>
              <div style={styles.userInfo}>
                <h2 style={styles.userName}>{user.fullName}</h2>
                <p style={styles.userEmail}>{user.email}</p>
                <span style={styles.roleBadge}>
                  {user.role === "admin" ? "👑 Admin" : "🎓 Student"}
                </span>
              </div>
            </div>
            {!isEditing && (
              <button style={styles.editButton} onClick={handleEditClick}>
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div style={styles.editForm}>
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>Edit Profile</h3>
                <button style={styles.cancelButton} onClick={handleCancelEdit}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveChanges} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <User size={18} />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Mail size={18} />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter your email"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Camera size={18} />
                    <span>Profile Picture URL</span>
                  </label>
                  <input
                    type="text"
                    name="photo_url"
                    value={editFormData.photo_url}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter image URL"
                  />
                </div>

                <button type="submit" style={styles.saveButton}>
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* Stats */}
          <div style={styles.statsSection}>
            <div style={styles.statItem}>
              <BookOpen size={24} style={{ color: "#6366f1" }} />
              <div>
                <p style={styles.statValue}>{enrolledCourses.length}</p>
                <p style={styles.statLabel}>Enrolled Courses</p>
              </div>
            </div>
            <div style={styles.statItem}>
              <Award size={24} style={{ color: "#8b5cf6" }} />
              <div>
                <p style={styles.statValue}>0</p>
                <p style={styles.statLabel}>Certificates</p>
              </div>
            </div>
            <div style={styles.statItem}>
              <Clock size={24} style={{ color: "#ec4899" }} />
              <div>
                <p style={styles.statValue}>12h</p>
                <p style={styles.statLabel}>Learning Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div style={styles.coursesCard}>
          <h3 style={styles.sectionTitle}>
            <BookOpen size={24} />
            <span>My Enrolled Courses</span>
          </h3>

          {enrolledCourses.length > 0 ? (
            <div style={styles.coursesList}>
              {enrolledCourses.map((course, index) => (
                <div
                  key={course?._id || index}
                  style={styles.courseItem}
                  onClick={() => navigate(`/course/${course?._id}`)}
                >
                  <div style={styles.courseItemLeft}>
                    <div style={styles.courseIcon}>
                      {course?.thumbnail ? (
                        <img src={course.thumbnail} alt={course?.title} style={styles.courseThumb} />
                      ) : (
                        <BookOpen size={20} />
                      )}
                    </div>
                    <div>
                      <h4 style={styles.courseItemTitle}>{course?.title || "Untitled Course"}</h4>
                      <p style={styles.courseItemMeta}>{course?.category || "General"}</p>
                    </div>
                  </div>
                  <div style={styles.courseItemRight}>
                    <span style={styles.continueButton}>Continue →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <BookOpen size={48} style={{ color: "#cbd5e1" }} />
              <p style={styles.emptyText}>No enrolled courses yet</p>
              <button style={styles.browseButton} onClick={() => navigate("/")}>
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "white",
    marginTop: "1rem",
    fontSize: "1.125rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "white",
    margin: 0,
  },
  logoutButton: {
    padding: "0.75rem 1.5rem",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  profileCard: {
    background: "white",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  profileHeader: {
    marginBottom: "2rem",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #6366f1",
  },
  statusDot: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    width: "16px",
    height: "16px",
    background: "#10b981",
    border: "3px solid white",
    borderRadius: "50%",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
  },
  userEmail: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0 0 0.75rem 0",
  },
  roleBadge: {
    display: "inline-block",
    padding: "0.375rem 0.75rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    justifyContent: "center",
  },
  editForm: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  formTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  cancelButton: {
    padding: "0.5rem",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#0f172a",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s ease",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1rem",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e2e8f0",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: 0,
  },
  coursesCard: {
    background: "white",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 1.5rem 0",
  },
  coursesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  courseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid #e2e8f0",
  },
  courseItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  courseIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "0.75rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    overflow: "hidden",
  },
  courseThumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  courseItemTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  courseItemMeta: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0.25rem 0 0 0",
  },
  courseItemRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  continueButton: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#6366f1",
  },
  emptyState: {
    padding: "3rem 2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "1rem",
    margin: 0,
  },
  browseButton: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Profile;
