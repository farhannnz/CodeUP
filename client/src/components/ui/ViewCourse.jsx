import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { 
  BookOpen, Play, Clock, Users, Award, Star, 
  CheckCircle, Lock, ArrowLeft, Download, Share2 
} from "lucide-react";
import Certificate from "./Certificate";

const ViewCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLectures, setCompletedLectures] = useState([]);
  const [userNotes, setUserNotes] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = Cookies.get("token");
        
        const response = await axios.get(`https://codeup-ql59.onrender.com/view-courses/${id}`);
        const courseData = response.data.course;
        
        if (token) {
          try {
            const profileResponse = await axios.get("https://codeup-ql59.onrender.com/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            const enrolledCourseIds = profileResponse.data.enrolledCourses || [];
            const isEnrolled = enrolledCourseIds.includes(id);
            
            if (isEnrolled) {
              try {
                const progressResponse = await axios.get(
                  `https://codeup-ql59.onrender.com/course-progress/${id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setCourseProgress(progressResponse.data.progress);
                setCompletedLectures(progressResponse.data.completedLectureIds || []);
                
                // Fetch user's notes for all lectures
                const profileResponse = await axios.get(
                  "https://codeup-ql59.onrender.com/profile",
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setUserNotes(profileResponse.data.notes || []);
                
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('showCertificate') === 'true' && progressResponse.data.isCompleted) {
                  generateCertificate();
                }
              } catch (progressError) {
                console.log("Progress tracking not available yet");
                setCourseProgress(0);
              }
            }
            
            setCourse({ ...courseData, enrolled: isEnrolled });
          } catch (profileError) {
            console.error("Error checking enrollment:", profileError);
            setCourse(courseData);
          }
        } else {
          setCourse(courseData);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      if (course.enrolled) {
        alert("You are already enrolled in this course!");
        return;
      }

      const response = await axios.post(
        "https://codeup-ql59.onrender.com/enroll-course",
        { courseId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Successfully enrolled in the course!");
        setCourse({ ...course, enrolled: true });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      const errorMessage = error.response?.data?.message || "Enrollment failed!";
      alert(errorMessage);
      
      if (errorMessage.includes("Already enrolled")) {
        setCourse({ ...course, enrolled: true });
      }
    }
  };

  const generateCertificate = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      console.log("Generating certificate for course:", id);

      const response = await axios.get(
        `https://codeup-ql59.onrender.com/generate-certificate/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Certificate response:", response.data);

      if (response.data.success) {
        setCertificateData(response.data.certificate);
        setShowCertificate(true);
      }
    } catch (error) {
      console.error("Certificate error:", error);
      const errorMsg = error.response?.data?.message || "Failed to generate certificate";
      
      if (error.response?.data?.progress !== undefined) {
        alert(
          `${errorMsg}\n\n` +
          `Progress: ${error.response.data.completedCount}/${error.response.data.totalLectures} lectures\n` +
          `(${error.response.data.progress}% complete)`
        );
      } else {
        alert(errorMsg);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading Course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>!</div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  if (!course) {
    return <div style={styles.noData}>No course data available</div>;
  }

  const isLectureCompleted = (lectureId) => {
    return completedLectures.includes(lectureId);
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <div style={styles.categoryBadge}>{course.category}</div>
            <h1 style={styles.courseTitle}>{course.title}</h1>
            <p style={styles.courseSubtitle}>{course.description}</p>
            
            <div style={styles.courseStats}>
              <div style={styles.statItem}>
                <Star size={18} fill="#fbbf24" color="#fbbf24" />
                <span>4.8 (2.5k reviews)</span>
              </div>
              <div style={styles.statItem}>
                <Users size={18} />
                <span>12,450 students</span>
              </div>
              <div style={styles.statItem}>
                <Clock size={18} />
                <span>{course.lectures?.length || 0} lectures</span>
              </div>
              <div style={styles.statItem}>
                <Award size={18} />
                <span>{course.courseLvel || "Beginner"}</span>
              </div>
            </div>

            {course.enrolled && (
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span>Your Progress</span>
                  <span style={styles.progressPercent}>{courseProgress}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${courseProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.heroRight}>
            <div style={styles.priceCard}>
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} style={styles.thumbnail} />
              )}
              <div style={styles.priceContent}>
                <div style={styles.priceTag}>
                  {course.Price > 0 ? `₹${course.Price}` : "Free"}
                </div>
                
                <button 
                  style={{
                    ...styles.enrollButton,
                    ...(course.enrolled ? styles.enrolledButton : {})
                  }}
                  onClick={handlePurchase}
                  disabled={course.enrolled}
                >
                  {course.enrolled ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Enrolled</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      <span>Enroll Now</span>
                    </>
                  )}
                </button>

                {courseProgress === 100 && (
                  <button style={styles.certificateBtn} onClick={generateCertificate}>
                    <Award size={20} />
                    <span>Get Certificate</span>
                  </button>
                )}

                <div style={styles.includes}>
                  <h4 style={styles.includesTitle}>This course includes:</h4>
                  <div style={styles.includeItem}>
                    <Play size={16} />
                    <span>{course.lectures?.length || 0} video lectures</span>
                  </div>
                  <div style={styles.includeItem}>
                    <Download size={16} />
                    <span>Downloadable resources</span>
                  </div>
                  <div style={styles.includeItem}>
                    <Award size={16} />
                    <span>Certificate of completion</span>
                  </div>
                  <div style={styles.includeItem}>
                    <Clock size={16} />
                    <span>Lifetime access</span>
                  </div>
                </div>

                <button style={styles.shareButton}>
                  <Share2 size={18} />
                  <span>Share Course</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(activeTab === "overview" ? styles.activeTab : {})}}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === "curriculum" ? styles.activeTab : {})}}
            onClick={() => setActiveTab("curriculum")}
          >
            Curriculum
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === "reviews" ? styles.activeTab : {})}}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          {course.enrolled && userNotes.length > 0 && (
            <button 
              style={{...styles.tab, ...(activeTab === "notes" ? styles.activeTab : {})}}
              onClick={() => setActiveTab("notes")}
            >
              My Notes ({userNotes.length})
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {activeTab === "overview" && (
          <div style={styles.overviewSection}>
            <h2 style={styles.sectionTitle}>About This Course</h2>
            <p style={styles.description}>{course.description || "No description available."}</p>
            
            <h3 style={styles.subSectionTitle}>What you'll learn</h3>
            <div style={styles.learningGrid}>
              <div style={styles.learningItem}>
                <CheckCircle size={20} color="#10b981" />
                <span>Master the fundamentals and advanced concepts</span>
              </div>
              <div style={styles.learningItem}>
                <CheckCircle size={20} color="#10b981" />
                <span>Build real-world projects from scratch</span>
              </div>
              <div style={styles.learningItem}>
                <CheckCircle size={20} color="#10b981" />
                <span>Get hands-on experience with industry tools</span>
              </div>
              <div style={styles.learningItem}>
                <CheckCircle size={20} color="#10b981" />
                <span>Prepare for professional certification</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div style={styles.curriculumSection}>
            <h2 style={styles.sectionTitle}>Course Curriculum</h2>
            <p style={styles.curriculumSubtitle}>
              {course.lectures?.length || 0} lectures • {Math.floor((course.lectures?.length || 0) * 15 / 60)}h {((course.lectures?.length || 0) * 15) % 60}m total length
            </p>
            
            <div style={styles.lecturesList}>
              {course.lectures && course.lectures.length > 0 ? (
                course.lectures.map((lecture, index) => {
                  const isCompleted = isLectureCompleted(lecture._id);
                  const isLocked = !course.enrolled && index > 0;
                  
                  return (
                    <div 
                      key={lecture._id} 
                      style={{
                        ...styles.lectureItem,
                        ...(isCompleted ? styles.completedLecture : {}),
                        ...(isLocked ? styles.lockedLecture : {})
                      }}
                      onClick={() => {
                        if (!isLocked) {
                          navigate(`/watch-lecture/${lecture._id}`);
                        }
                      }}
                    >
                      <div style={styles.lectureLeft}>
                        <div style={styles.lectureNumber}>{index + 1}</div>
                        <div>
                          <div style={styles.lectureTitle}>{lecture.lectureTitle}</div>
                          <div style={styles.lectureMeta}>
                            <Clock size={14} />
                            <span>15 min</span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.lectureRight}>
                        {isCompleted ? (
                          <CheckCircle size={20} color="#10b981" />
                        ) : isLocked ? (
                          <Lock size={20} color="#94a3b8" />
                        ) : (
                          <Play size={20} color="#6366f1" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={styles.noLectures}>No lectures available yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={styles.reviewsSection}>
            <h2 style={styles.sectionTitle}>Student Reviews</h2>
            <div style={styles.ratingOverview}>
              <div style={styles.ratingScore}>
                <div style={styles.bigRating}>4.8</div>
                <div style={styles.stars}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <div style={styles.ratingCount}>2,543 ratings</div>
              </div>
            </div>
            
            <div style={styles.reviewsList}>
              {[1,2,3].map(i => (
                <div key={i} style={styles.reviewItem}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewerAvatar}>JD</div>
                    <div>
                      <div style={styles.reviewerName}>John Doe</div>
                      <div style={styles.reviewDate}>2 weeks ago</div>
                    </div>
                  </div>
                  <div style={styles.reviewStars}>
                    {[1,2,3,4,5].map(j => (
                      <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p style={styles.reviewText}>
                    Excellent course! The instructor explains everything clearly and the projects are very practical.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && course.enrolled && (
          <div style={styles.notesSection}>
            <h2 style={styles.sectionTitle}>My Notes</h2>
            <p style={styles.notesSubtitle}>Your personal notes for each lecture</p>
            
            {userNotes.length === 0 ? (
              <div style={styles.emptyNotes}>
                <BookOpen size={48} color="#cbd5e1" />
                <p>No notes yet. Start taking notes while watching lectures!</p>
              </div>
            ) : (
              <div style={styles.notesList}>
                {userNotes.map((note, index) => {
                  const lecture = course.lectures?.find(l => l._id === note.lectureId?.toString());
                  return (
                    <div key={index} style={styles.noteItem}>
                      <div style={styles.noteHeader}>
                        <div style={styles.noteLectureTitle}>
                          <BookOpen size={18} />
                          <span>{lecture?.lectureTitle || "Lecture"}</span>
                        </div>
                        <div style={styles.noteDate}>
                          {new Date(note.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={styles.noteContent}>
                        {note.content}
                      </div>
                      <button
                        style={styles.viewLectureBtn}
                        onClick={() => navigate(`/watch-lecture/${note.lectureId}`)}
                      >
                        Go to Lecture →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showCertificate && certificateData && (
        <Certificate 
          certificateData={certificateData}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
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
    fontSize: "1.125rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  errorIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  retryBtn: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  },
  noData: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.125rem",
    color: "#64748b",
  },
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem 1rem 3rem",
    color: "white",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "0.5rem",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "2rem",
    maxWidth: "1200px",
    margin: "0 auto 2rem",
  },
  heroContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "3rem",
  },
  heroLeft: {
    paddingTop: "1rem",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "0.375rem 0.875rem",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  courseTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 1rem 0",
    lineHeight: "1.2",
  },
  courseSubtitle: {
    fontSize: "1.125rem",
    opacity: 0.9,
    marginBottom: "1.5rem",
    lineHeight: "1.6",
  },
  courseStats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  progressSection: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1.25rem",
    borderRadius: "0.75rem",
    marginTop: "1.5rem",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: "1.125rem",
  },
  progressBar: {
    height: "8px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "white",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  heroRight: {
    position: "relative",
  },
  priceCard: {
    background: "white",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: "2rem",
  },
  thumbnail: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  priceContent: {
    padding: "1.5rem",
  },
  priceTag: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  enrollButton: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    transition: "transform 0.2s ease",
  },
  enrolledButton: {
    background: "#10b981",
    cursor: "not-allowed",
  },
  certificateBtn: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  includes: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
  },
  includesTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  includeItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
    color: "#475569",
    fontSize: "0.875rem",
  },
  shareButton: {
    width: "100%",
    padding: "0.75rem",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  tabsContainer: {
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tabs: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "2rem",
    padding: "0 1rem",
  },
  tab: {
    padding: "1rem 0",
    background: "none",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "2px solid transparent",
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTab: {
    color: "#6366f1",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "2px solid #6366f1",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 1rem",
  },
  overviewSection: {},
  sectionTitle: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1.5rem",
  },
  description: {
    fontSize: "1.125rem",
    color: "#475569",
    lineHeight: "1.8",
    marginBottom: "2rem",
  },
  subSectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  learningGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
  },
  learningItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#475569",
  },
  curriculumSection: {},
  curriculumSubtitle: {
    color: "#64748b",
    marginBottom: "2rem",
  },
  lecturesList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  lectureItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  completedLecture: {
    background: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  lockedLecture: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  lectureLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  lectureNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "#475569",
  },
  lectureTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "0.25rem",
  },
  lectureMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  lectureRight: {},
  noLectures: {
    textAlign: "center",
    padding: "2rem",
    color: "#64748b",
  },
  reviewsSection: {},
  ratingOverview: {
    background: "white",
    padding: "2rem",
    borderRadius: "1rem",
    marginBottom: "2rem",
  },
  ratingScore: {
    textAlign: "center",
  },
  bigRating: {
    fontSize: "4rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "0.5rem",
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "0.25rem",
    marginBottom: "0.5rem",
  },
  ratingCount: {
    color: "#64748b",
    fontSize: "0.875rem",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  reviewItem: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  reviewerAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  reviewerName: {
    fontWeight: "600",
    color: "#0f172a",
  },
  reviewDate: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  reviewStars: {
    display: "flex",
    gap: "0.25rem",
    marginBottom: "0.75rem",
  },
  reviewText: {
    color: "#475569",
    lineHeight: "1.6",
  },
  notesSection: {},
  notesSubtitle: {
    color: "#64748b",
    marginBottom: "2rem",
  },
  emptyNotes: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "white",
    borderRadius: "1rem",
    color: "#64748b",
  },
  notesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  noteItem: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
  },
  noteHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #f1f5f9",
  },
  noteLectureTitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
  },
  noteDate: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  noteContent: {
    fontSize: "0.9375rem",
    color: "#475569",
    lineHeight: "1.7",
    marginBottom: "1rem",
    whiteSpace: "pre-wrap",
  },
  viewLectureBtn: {
    padding: "0.625rem 1.25rem",
    background: "#f8fafc",
    color: "#6366f1",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default ViewCourse;
