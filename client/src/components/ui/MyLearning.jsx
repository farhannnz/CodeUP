import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, Clock } from "lucide-react";

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = Cookies.get("token");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching profile with token...");
        const profileResponse = await axios.get("https://codeup-ql59.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile response:", profileResponse.data);
        const enrolledCourseIds = profileResponse.data.enrolledCourses || [];
        console.log("Enrolled course IDs:", enrolledCourseIds);

        if (enrolledCourseIds.length === 0) {
          console.log("No enrolled courses found");
          setEnrolledCourses([]);
          setLoading(false);
          return;
        }

        console.log("Fetching course details...");
        const coursePromises = enrolledCourseIds.map((courseId) =>
          axios.get(`https://codeup-ql59.onrender.com/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => {
            console.error(`Error fetching course ${courseId}:`, err);
            return null;
          })
        );

        const courseResponses = await Promise.all(coursePromises);
        console.log("Course responses:", courseResponses);
        
        // Filter out null responses and extract valid courses
        // Server returns course directly in response.data (not response.data.course)
        const courses = courseResponses
          .filter(response => response && response.data)
          .map((response) => response.data);
        
        console.log("Final courses to display:", courses);
        setEnrolledCourses(courses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          Cookies.remove("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your courses...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Learning</h1>
          <p style={styles.subtitle}>
            {enrolledCourses.length > 0 
              ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''}`
              : "Start your learning journey today"
            }
          </p>
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <BookOpen size={64} />
          </div>
          <h2 style={styles.emptyTitle}>No courses yet</h2>
          <p style={styles.emptyText}>
            Explore our course catalog and start learning something new today
          </p>
          <button style={styles.browseButton} onClick={() => navigate("/")}>
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <BookOpen size={24} />
              </div>
              <div>
                <div style={styles.statValue}>{enrolledCourses.length}</div>
                <div style={styles.statLabel}>Enrolled Courses</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div style={styles.statValue}>0%</div>
                <div style={styles.statLabel}>Average Progress</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div>
                <div style={styles.statValue}>0h</div>
                <div style={styles.statLabel}>Learning Time</div>
              </div>
            </div>
          </div>

          <div style={styles.coursesSection}>
            <h2 style={styles.sectionTitle}>Continue Learning</h2>
            <div style={styles.grid}>
              {enrolledCourses.map((course, index) => (
                <CourseCard
                  key={course?._id || index}
                  id={course?._id}
                  image={course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                  name={course?.title || "Untitled Course"}
                  price="Enrolled"
                  instructor="Expert Instructor"
                  rating="4.8"
                  students="1.2k"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    marginTop: '0.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  spinner: {
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  emptyIcon: {
    display: 'inline-flex',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
    borderRadius: '50%',
    color: '#6366f1',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.75rem',
  },
  emptyText: {
    fontSize: '1.125rem',
    color: '#64748b',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },
  browseButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6366f1',
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  coursesSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
};

export default MyLearning;
