import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Edit, Video, BookOpen, Users, TrendingUp, DollarSign,
  BarChart3, Eye, LogOut, Clock, Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch courses
        const coursesResponse = await axios.get("https://codeup-ql59.onrender.com/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(coursesResponse.data.courses);

        // Fetch admin stats
        const statsResponse = await axios.get("https://codeup-ql59.onrender.com/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data.stats);

        // Fetch enrollment trends
        const trendsResponse = await axios.get("https://codeup-ql59.onrender.com/admin/enrollment-trends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrends(trendsResponse.data.trends);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 403) {
          alert("Access denied. Admin only.");
          navigate("/");
        } else {
          alert("Session Expired! Please Login Again.");
          Cookies.remove("token");
          navigate("/login");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will delete all lectures, comments, and student progress for this course. This action cannot be undone.`)) {
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `https://codeup-ql59.onrender.com/admin/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Course deleted successfully!");
        // Remove from local state
        setCourses(courses.filter(c => c._id !== courseId));
        // Refresh stats
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading Dashboard...</p>
      </div>
    );
  }

  const maxEnrollments = Math.max(...trends.map(t => t.enrollments), 1);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage your courses and track performance</p>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "#dbeafe"}}>
            <BookOpen size={24} color="#2563eb" />
          </div>
          <div>
            <div style={styles.statValue}>{stats?.totalCourses || 0}</div>
            <div style={styles.statLabel}>Total Courses</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "#f3e8ff"}}>
            <Users size={24} color="#7c3aed" />
          </div>
          <div>
            <div style={styles.statValue}>{stats?.totalUsers || 0}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "#fce7f3"}}>
            <Video size={24} color="#db2777" />
          </div>
          <div>
            <div style={styles.statValue}>{stats?.totalLectures || 0}</div>
            <div style={styles.statLabel}>Total Lectures</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "#dcfce7"}}>
            <DollarSign size={24} color="#16a34a" />
          </div>
          <div>
            <div style={styles.statValue}>₹{stats?.totalRevenue || 0}</div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* Enrollment Trends Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <TrendingUp size={20} />
            <span>Enrollment Trends (Last 12 Months)</span>
          </h3>
          <div style={styles.chart}>
            {trends.map((trend, index) => (
              <div key={index} style={styles.chartBar}>
                <div style={styles.chartBarContainer}>
                  <div 
                    style={{
                      ...styles.chartBarFill,
                      height: `${(trend.enrollments / maxEnrollments) * 100}%`
                    }}
                  >
                    <span style={styles.chartBarValue}>{trend.enrollments}</span>
                  </div>
                </div>
                <div style={styles.chartBarLabel}>{trend.month.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <BarChart3 size={20} />
            <span>Top Performing Courses</span>
          </h3>
          <div style={styles.topCoursesList}>
            {stats?.topCourses?.map((course, index) => (
              <div key={index} style={styles.topCourseItem}>
                <div style={styles.topCourseRank}>{index + 1}</div>
                <div style={styles.topCourseInfo}>
                  <div style={styles.topCourseTitle}>{course.title}</div>
                  <div style={styles.topCourseMeta}>
                    {course.enrolledStudents?.length || 0} students • ₹{course.Price}
                  </div>
                </div>
                <div style={styles.topCourseRevenue}>
                  ₹{(course.Price * (course.enrolledStudents?.length || 0))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button style={styles.actionButton} onClick={() => navigate("/create-course")}>
            <Plus size={24} />
            <span>Create New Course</span>
          </button>
          <button style={styles.actionButton} onClick={() => navigate("/courses")}>
            <BookOpen size={24} />
            <span>View All Courses</span>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div style={styles.coursesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All Courses</h2>
          <button style={styles.createButton} onClick={() => navigate("/create-course")}>
            <Plus size={18} />
            <span>Create Course</span>
          </button>
        </div>

        <div style={styles.coursesGrid}>
          {courses.map((course) => (
            <div key={course._id} style={styles.courseCard}>
              <div style={styles.courseImage}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={styles.courseThumbnail} />
                ) : (
                  <div style={styles.coursePlaceholder}>
                    <BookOpen size={32} />
                  </div>
                )}
              </div>
              
              <div style={styles.courseContent}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseCategory}>{course.category}</p>
                
                <div style={styles.courseStats}>
                  <div style={styles.courseStat}>
                    <Users size={16} />
                    <span>{course.enrolledStudents?.length || 0} students</span>
                  </div>
                  <div style={styles.courseStat}>
                    <Video size={16} />
                    <span>{course.lectures?.length || 0} lectures</span>
                  </div>
                </div>

                <div style={styles.coursePrice}>₹{course.Price || 0}</div>

                <div style={styles.courseActions}>
                  <button 
                    style={styles.viewButton}
                    onClick={() => navigate(`/admin/course/${course._id}/analytics`)}
                  >
                    <Eye size={16} />
                    <span>Analytics</span>
                  </button>
                  <button 
                    style={styles.editButton}
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button 
                    style={styles.addLectureButton}
                    onClick={() => navigate(`/add-lecture/${course._id}`)}
                  >
                    <Plus size={16} />
                    <span>Lecture</span>
                  </button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div style={styles.emptyState}>
            <BookOpen size={64} color="#cbd5e1" />
            <h3 style={styles.emptyTitle}>No courses yet</h3>
            <p style={styles.emptyText}>Create your first course to get started</p>
            <button style={styles.emptyButton} onClick={() => navigate("/create-course")}>
              <Plus size={20} />
              <span>Create Course</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "2rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#64748b",
    marginTop: "1rem",
  },
  header: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: "0.5rem",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    color: "#475569",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  statsGrid: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  statCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  chartsRow: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "1.5rem",
  },
  chartCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.125rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1.5rem",
  },
  chart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "200px",
    gap: "0.5rem",
  },
  chartBar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chartBarContainer: {
    width: "100%",
    height: "180px",
    display: "flex",
    alignItems: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
    borderRadius: "0.25rem 0.25rem 0 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "0.5rem",
    transition: "height 0.3s ease",
  },
  chartBarValue: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "white",
  },
  chartBarLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.5rem",
  },
  topCoursesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  topCourseItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
  },
  topCourseRank: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "0.875rem",
  },
  topCourseInfo: {
    flex: 1,
  },
  topCourseTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "0.25rem",
  },
  topCourseMeta: {
    fontSize: "0.75rem",
    color: "#64748b",
  },
  topCourseRevenue: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#16a34a",
  },
  actionsSection: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  actionButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    padding: "2rem",
    background: "white",
    border: "2px dashed #e2e8f0",
    borderRadius: "1rem",
    color: "#6366f1",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  coursesSection: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
  },
  courseCard: {
    background: "white",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
  },
  courseImage: {
    width: "100%",
    height: "180px",
    background: "#f1f5f9",
    overflow: "hidden",
  },
  courseThumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coursePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#cbd5e1",
  },
  courseContent: {
    padding: "1.5rem",
  },
  courseTitle: {
    fontSize: "1.125rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  courseCategory: {
    fontSize: "0.875rem",
    color: "#6366f1",
    marginBottom: "1rem",
  },
  courseStats: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  courseStat: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  coursePrice: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: "1rem",
  },
  courseActions: {
    display: "flex",
    gap: "0.5rem",
  },
  viewButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.625rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    color: "#475569",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  editButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.625rem",
    background: "#fef3c7",
    border: "1px solid #fde047",
    borderRadius: "0.5rem",
    color: "#854d0e",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  addLectureButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.625rem",
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    borderRadius: "0.5rem",
    color: "#1e40af",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.625rem",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "0.5rem",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "1rem 0 0.5rem",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "2rem",
  },
  emptyButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 2rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AdminDashboard;
