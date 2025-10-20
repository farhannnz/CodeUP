import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Users, TrendingUp, DollarSign, Award, 
  CheckCircle, Clock, Search, Download, Trash2, Video, Plus
} from "lucide-react";

const CourseAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `https://codeup-ql59.onrender.com/admin/course/${id}/analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setAnalytics(response.data.analytics);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        alert("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading Analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <div style={styles.error}>Failed to load analytics</div>;
  }

  const handleDeleteLecture = async (lectureId, lectureTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${lectureTitle}"? This will remove all student progress and comments for this lecture.`)) {
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `https://codeup-ql59.onrender.com/admin/lecture/${lectureId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Lecture deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  const filteredStudents = analytics.students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "completed" && student.isCompleted) ||
                         (filterStatus === "in-progress" && !student.isCompleted);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/admin")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1 style={styles.title}>Course Analytics</h1>
      </div>

      {/* Course Info */}
      <div style={styles.courseInfo}>
        {analytics.course.thumbnail && (
          <img src={analytics.course.thumbnail} alt={analytics.course.title} style={styles.courseThumbnail} />
        )}
        <div>
          <h2 style={styles.courseTitle}>{analytics.course.title}</h2>
          <p style={styles.courseCategory}>{analytics.course.category}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon} style={{...styles.statIcon, background: "#dbeafe"}}>
            <Users size={24} color="#2563eb" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.stats.totalEnrolled}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon} style={{...styles.statIcon, background: "#dcfce7"}}>
            <CheckCircle size={24} color="#16a34a" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.stats.completedStudents}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon} style={{...styles.statIcon, background: "#fef3c7"}}>
            <TrendingUp size={24} color="#ca8a04" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.stats.averageProgress}%</div>
            <div style={styles.statLabel}>Avg Progress</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon} style={{...styles.statIcon, background: "#fce7f3"}}>
            <DollarSign size={24} color="#db2777" />
          </div>
          <div>
            <div style={styles.statValue}>₹{analytics.stats.revenue}</div>
            <div style={styles.statLabel}>Revenue</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Student Progress Distribution</h3>
        <div style={styles.progressBars}>
          {[
            { label: "Completed (100%)", count: analytics.students.filter(s => s.progress === 100).length, color: "#16a34a" },
            { label: "In Progress (50-99%)", count: analytics.students.filter(s => s.progress >= 50 && s.progress < 100).length, color: "#ca8a04" },
            { label: "Started (1-49%)", count: analytics.students.filter(s => s.progress > 0 && s.progress < 50).length, color: "#2563eb" },
            { label: "Not Started (0%)", count: analytics.students.filter(s => s.progress === 0).length, color: "#dc2626" }
          ].map((item, index) => {
            const percentage = analytics.students.length > 0 
              ? (item.count / analytics.students.length) * 100 
              : 0;
            return (
              <div key={index} style={styles.progressBarItem}>
                <div style={styles.progressBarLabel}>
                  <span>{item.label}</span>
                  <span style={styles.progressBarCount}>{item.count} students</span>
                </div>
                <div style={styles.progressBarTrack}>
                  <div 
                    style={{
                      ...styles.progressBarFill,
                      width: `${percentage}%`,
                      background: item.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lectures Management */}
      <div style={styles.lecturesCard}>
        <div style={styles.lecturesHeader}>
          <h3 style={styles.chartTitle}>
            <Video size={20} />
            <span>Course Lectures ({analytics.course.totalLectures})</span>
          </h3>
          <button 
            style={styles.addLectureBtn}
            onClick={() => navigate(`/add-lecture/${id}`)}
          >
            <Plus size={18} />
            <span>Add Lecture</span>
          </button>
        </div>
        
        {/* Note: We need to fetch lectures separately or include in analytics */}
        <div style={styles.lecturesNote}>
          <p>Manage lectures from the main admin dashboard or add new lectures using the button above.</p>
        </div>
      </div>

      {/* Students Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Enrolled Students</h3>
          <div style={styles.tableControls}>
            <div style={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Students</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>

        <div style={styles.table}>
          <div style={styles.tableHeaderRow}>
            <div style={styles.tableCell}>Student</div>
            <div style={styles.tableCell}>Email</div>
            <div style={styles.tableCell}>Progress</div>
            <div style={styles.tableCell}>Lectures</div>
            <div style={styles.tableCell}>Status</div>
            <div style={styles.tableCell}>Enrolled</div>
          </div>

          {filteredStudents.length === 0 ? (
            <div style={styles.emptyState}>
              <Users size={48} color="#cbd5e1" />
              <p>No students found</p>
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <div key={index} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentAvatar}>
                      {student.studentPhoto ? (
                        <img src={student.studentPhoto} alt="" style={styles.avatarImg} />
                      ) : (
                        <span>{student.studentName.charAt(0)}</span>
                      )}
                    </div>
                    <span style={styles.studentName}>{student.studentName}</span>
                  </div>
                </div>
                <div style={styles.tableCell}>{student.studentEmail}</div>
                <div style={styles.tableCell}>
                  <div style={styles.progressCell}>
                    <div style={styles.progressMini}>
                      <div 
                        style={{
                          ...styles.progressMiniFill,
                          width: `${student.progress}%`,
                          background: student.progress === 100 ? "#16a34a" : "#2563eb"
                        }}
                      ></div>
                    </div>
                    <span style={styles.progressText}>{student.progress}%</span>
                  </div>
                </div>
                <div style={styles.tableCell}>
                  {student.completedLectures}/{student.totalLectures}
                </div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(student.isCompleted ? styles.statusCompleted : styles.statusInProgress)
                  }}>
                    {student.isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  {new Date(student.enrolledDate).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
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
  error: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.125rem",
    color: "#dc2626",
  },
  header: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    color: "#475569",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },
  courseInfo: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  courseThumbnail: {
    width: "100px",
    height: "60px",
    borderRadius: "0.5rem",
    objectFit: "cover",
  },
  courseTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
  },
  courseCategory: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: 0,
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
  chartCard: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    background: "white",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1.5rem",
  },
  progressBars: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  progressBarItem: {},
  progressBarLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    color: "#475569",
  },
  progressBarCount: {
    fontWeight: "600",
  },
  progressBarTrack: {
    height: "8px",
    background: "#f1f5f9",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  tableCard: {
    maxWidth: "1400px",
    margin: "0 auto",
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  tableTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  tableControls: {
    display: "flex",
    gap: "1rem",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "0.875rem",
    color: "#0f172a",
  },
  filterSelect: {
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#0f172a",
    cursor: "pointer",
    outline: "none",
  },
  table: {
    overflow: "auto",
  },
  tableHeaderRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 1.5fr",
    padding: "1rem 1.5rem",
    background: "#f8fafc",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 1.5fr",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.875rem",
    color: "#475569",
    alignItems: "center",
  },
  tableCell: {
    padding: "0 0.5rem",
  },
  studentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  studentAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#6366f1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "0.875rem",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  studentName: {
    fontWeight: "500",
    color: "#0f172a",
  },
  progressCell: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  progressMini: {
    flex: 1,
    height: "6px",
    background: "#f1f5f9",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressMiniFill: {
    height: "100%",
    borderRadius: "3px",
  },
  progressText: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    minWidth: "40px",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  statusCompleted: {
    background: "#dcfce7",
    color: "#166534",
  },
  statusInProgress: {
    background: "#dbeafe",
    color: "#1e40af",
  },
  emptyState: {
    padding: "3rem",
    textAlign: "center",
    color: "#94a3b8",
  },
  lecturesCard: {
    maxWidth: "1400px",
    margin: "0 auto 2rem",
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  lecturesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  addLectureBtn: {
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
  lecturesNote: {
    padding: "1.5rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
    color: "#64748b",
    fontSize: "0.875rem",
  },
};

export default CourseAnalytics;
