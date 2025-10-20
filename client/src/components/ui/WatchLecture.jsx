import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings, 
  ChevronLeft, ChevronRight, CheckCircle, Clock, 
  BookOpen, MessageSquare, FileText, Download, Share2,
  ThumbsUp, Flag, List, X
} from "lucide-react";

const WatchLecture = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savingNotes, setSavingNotes] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://codeup-ql59.onrender.com/lectures/${lectureId}`);
        const lectureData = response.data.lecture;
        setLecture(lectureData);

        // Fetch course details
        if (lectureData.courseId) {
          const courseResponse = await axios.get(`https://codeup-ql59.onrender.com/view-courses/${lectureData.courseId}`);
          const courseData = courseResponse.data.course;
          setCourse(courseData);
          setAllLectures(courseData.lectures || []);
        }

        // Set likes count
        setLikesCount(lectureData.likes?.length || 0);

        // Check if lecture is completed and liked
        const token = Cookies.get("token");
        if (token && lectureData.courseId) {
          try {
            // Get user profile to check liked lectures
            const profileResponse = await axios.get(
              "https://codeup-ql59.onrender.com/profile",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Check if user liked this lecture
            setIsLiked(profileResponse.data.likedLectures?.some(id => id === lectureId));
            
            // Get progress
            const progressResponse = await axios.get(
              `https://codeup-ql59.onrender.com/course-progress/${lectureData.courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsCompleted(progressResponse.data.completedLectureIds?.includes(lectureId));
            
            // Fetch user's notes
            const notesResponse = await axios.get(
              `https://codeup-ql59.onrender.com/lectures/${lectureId}/notes`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (notesResponse.data.note) {
              setNotes(notesResponse.data.note.content);
            }
          } catch (err) {
            console.log("Progress tracking not available");
          }
        }
        
        // Fetch comments
        fetchComments();
      } catch (err) {
        setError("Error fetching the lecture.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://codeup-ql59.onrender.com/lectures/${lectureId}/comments`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login to like this lecture");
        return;
      }

      const response = await axios.post(
        `https://codeup-ql59.onrender.com/lectures/${lectureId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error("Error liking lecture:", error);
      alert("Failed to like lecture");
    }
  };

  const handleSaveNotes = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login to save notes");
        return;
      }

      setSavingNotes(true);
      const response = await axios.post(
        `https://codeup-ql59.onrender.com/lectures/${lectureId}/notes`,
        { content: notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Notes saved successfully!");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login to post a comment");
        return;
      }

      setPostingComment(true);
      const response = await axios.post(
        `https://codeup-ql59.onrender.com/lectures/${lectureId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `https://codeup-ql59.onrender.com/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const markAsCompleted = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please login to mark lectures as complete");
        return;
      }

      if (!lecture || !lecture.courseId) {
        alert("Lecture data not loaded");
        return;
      }

      console.log("Marking lecture as complete:", { lectureId, courseId: lecture.courseId });

      const response = await axios.post(
        "https://codeup-ql59.onrender.com/complete-lecture",
        {
          lectureId: lectureId,
          courseId: lecture.courseId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Mark complete response:", response.data);

      if (response.data.success) {
        setIsCompleted(true);
        
        const progressMsg = `✅ Lecture completed!\n\nProgress: ${response.data.completedCount}/${response.data.totalLectures} lectures (${response.data.progress}%)`;
        
        if (response.data.isCompleted && response.data.progress === 100) {
          const viewCert = window.confirm(
            `🎉 Congratulations! You've completed the entire course!\n\n` +
            `${response.data.completedCount}/${response.data.totalLectures} lectures completed\n\n` +
            `Would you like to view your certificate?`
          );
          if (viewCert) {
            navigate(`/course/${lecture.courseId}?showCertificate=true`);
          }
        } else {
          alert(progressMsg);
        }
      }
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
      alert(error.response?.data?.message || "Failed to mark lecture as complete. Please try again.");
    }
  };

  const getCurrentLectureIndex = () => {
    return allLectures.findIndex(l => l._id === lectureId);
  };

  const goToNextLecture = () => {
    const currentIndex = getCurrentLectureIndex();
    if (currentIndex < allLectures.length - 1) {
      navigate(`/watch-lecture/${allLectures[currentIndex + 1]._id}`);
    }
  };

  const goToPreviousLecture = () => {
    const currentIndex = getCurrentLectureIndex();
    if (currentIndex > 0) {
      navigate(`/watch-lecture/${allLectures[currentIndex - 1]._id}`);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading Lecture...</p>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>!</div>
        <p>{error || "Lecture not found"}</p>
        <button onClick={() => navigate(-1)} style={styles.retryBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const currentIndex = getCurrentLectureIndex();
  const hasNext = currentIndex < allLectures.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          <span>Back to Course</span>
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.courseTitle}>{course?.title || "Course"}</h1>
          <div style={styles.lectureProgress}>
            Lecture {currentIndex + 1} of {allLectures.length}
          </div>
        </div>
        <button 
          style={styles.sidebarToggle}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <List size={20} />
        </button>
      </div>

      <div style={styles.mainContent}>
        {/* Video Section */}
        <div style={styles.videoSection}>
          <div style={styles.videoContainer}>
            <iframe
              src={getEmbedUrl(lecture.videoUrl)}
              title={lecture.lectureTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={styles.videoIframe}
            ></iframe>
          </div>

          {/* Video Info */}
          <div style={styles.videoInfo}>
            <div style={styles.videoHeader}>
              <div>
                <h2 style={styles.lectureTitle}>{lecture.lectureTitle}</h2>
                <div style={styles.lectureMeta}>
                  <span style={styles.metaItem}>
                    <Clock size={16} />
                    {lecture.duration || "15:30"}
                  </span>
                  {isCompleted && (
                    <span style={styles.completedBadge}>
                      <CheckCircle size={16} />
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <button 
                style={{
                  ...styles.completeButton,
                  ...(isCompleted ? styles.completedButton : {})
                }}
                onClick={markAsCompleted}
                disabled={isCompleted}
              >
                <CheckCircle size={20} />
                {isCompleted ? "Completed" : "Mark as Complete"}
              </button>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button 
                style={{
                  ...styles.actionBtn,
                  ...(isLiked ? styles.actionBtnActive : {})
                }}
                onClick={handleLike}
                title={isLiked ? "Click to unlike" : "Click to like"}
              >
                <ThumbsUp size={18} fill={isLiked ? "#6366f1" : "none"} />
                <span>{isLiked ? "Liked" : "Like"} ({likesCount})</span>
              </button>
              <button style={styles.actionBtn}>
                <Share2 size={18} />
                <span>Share</span>
              </button>
              {lecture.resources && lecture.resources.length > 0 && (
                <button 
                  style={styles.actionBtn}
                  onClick={() => setActiveTab("overview")}
                >
                  <Download size={18} />
                  <span>Resources ({lecture.resources.length})</span>
                </button>
              )}
              <button style={styles.actionBtn}>
                <Flag size={18} />
                <span>Report</span>
              </button>
            </div>

            {/* Navigation */}
            <div style={styles.navigation}>
              <button 
                style={{
                  ...styles.navButton,
                  ...(!hasPrevious ? styles.navButtonDisabled : {})
                }}
                onClick={goToPreviousLecture}
                disabled={!hasPrevious}
              >
                <ChevronLeft size={20} />
                <span>Previous Lecture</span>
              </button>
              <button 
                style={{
                  ...styles.navButton,
                  ...styles.navButtonPrimary,
                  ...(!hasNext ? styles.navButtonDisabled : {})
                }}
                onClick={goToNextLecture}
                disabled={!hasNext}
              >
                <span>Next Lecture</span>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              <button 
                style={{
                  ...styles.tab,
                  ...(activeTab === "overview" ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab("overview")}
              >
                <BookOpen size={18} />
                <span>Overview</span>
              </button>
              <button 
                style={{
                  ...styles.tab,
                  ...(activeTab === "notes" ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab("notes")}
              >
                <FileText size={18} />
                <span>Notes</span>
              </button>
              <button 
                style={{
                  ...styles.tab,
                  ...(activeTab === "discussion" ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab("discussion")}
              >
                <MessageSquare size={18} />
                <span>Discussion</span>
              </button>
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
              {activeTab === "overview" && (
                <div style={styles.overviewContent}>
                  <h3 style={styles.contentTitle}>About this lecture</h3>
                  <p style={styles.contentText}>
                    {lecture.description || "In this lecture, you'll learn important concepts and practical skills that will help you master the subject."}
                  </p>
                  
                  {lecture.resources && lecture.resources.length > 0 && (
                    <>
                      <h4 style={styles.contentSubtitle}>Resources</h4>
                      <div style={styles.resourcesList}>
                        {lecture.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.resourceLink}
                          >
                            <span style={styles.resourceIcon}>
                              {resource.type === 'pdf' ? '📄' : resource.type === 'file' ? '📎' : '🔗'}
                            </span>
                            <span>{resource.title}</span>
                            <Download size={16} />
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "notes" && (
                <div style={styles.notesContent}>
                  <h3 style={styles.contentTitle}>My Notes</h3>
                  <textarea
                    style={styles.notesTextarea}
                    placeholder="Take notes while watching..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button 
                    style={{
                      ...styles.saveNotesBtn,
                      opacity: savingNotes ? 0.7 : 1
                    }}
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              )}

              {activeTab === "discussion" && (
                <div style={styles.discussionContent}>
                  <h3 style={styles.contentTitle}>Discussion</h3>
                  <div style={styles.commentBox}>
                    <textarea
                      style={styles.commentInput}
                      placeholder="Ask a question or share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                      style={{
                        ...styles.postCommentBtn,
                        opacity: postingComment ? 0.7 : 1
                      }}
                      onClick={handlePostComment}
                      disabled={postingComment}
                    >
                      {postingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                  <div style={styles.commentsSection}>
                    {comments.length === 0 ? (
                      <p style={styles.noComments}>No comments yet. Be the first to start the discussion!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} style={styles.commentItem}>
                          <div style={styles.commentHeader}>
                            <div style={styles.commentAvatar}>
                              {comment.userId?.photo_url ? (
                                <img src={comment.userId.photo_url} alt="" style={styles.avatarImg} />
                              ) : (
                                <span>{comment.userId?.fullName?.charAt(0) || "U"}</span>
                              )}
                            </div>
                            <div style={styles.commentMeta}>
                              <div style={styles.commentAuthor}>{comment.userId?.fullName || "User"}</div>
                              <div style={styles.commentDate}>
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {Cookies.get("token") && (
                              <button
                                style={styles.deleteCommentBtn}
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          <p style={styles.commentText}>{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>Course Content</h3>
              <button 
                style={styles.closeSidebar}
                onClick={() => setShowSidebar(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.lecturesList}>
              {allLectures.map((lec, index) => (
                <div
                  key={lec._id}
                  style={{
                    ...styles.lectureItem,
                    ...(lec._id === lectureId ? styles.activeLectureItem : {})
                  }}
                  onClick={() => navigate(`/watch-lecture/${lec._id}`)}
                >
                  <div style={styles.lectureItemLeft}>
                    <div style={styles.lectureItemNumber}>{index + 1}</div>
                    <div>
                      <div style={styles.lectureItemTitle}>{lec.lectureTitle}</div>
                      <div style={styles.lectureItemDuration}>
                        <Clock size={12} />
                        {lec.duration || "15:30"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.lectureItemRight}>
                    {lec._id === lectureId ? (
                      <Play size={18} color="#6366f1" fill="#6366f1" />
                    ) : (
                      <Play size={18} color="#94a3b8" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0f172a",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "4px solid #1e293b",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: "1rem",
    fontSize: "1rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0f172a",
  },
  errorIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#1e293b",
    color: "#ef4444",
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
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
    padding: "0 2rem",
  },
  courseTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    margin: 0,
    color: "#f1f5f9",
  },
  lectureProgress: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    marginTop: "0.25rem",
  },
  sidebarToggle: {
    padding: "0.5rem",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    display: "flex",
    height: "calc(100vh - 73px)",
  },
  videoSection: {
    flex: 1,
    overflow: "auto",
    background: "#0f172a",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    background: "#000",
  },
  videoIframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  videoInfo: {
    padding: "2rem",
  },
  videoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #1e293b",
  },
  lectureTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#f1f5f9",
    margin: "0 0 0.5rem 0",
  },
  lectureMeta: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
  completedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.375rem 0.75rem",
    background: "#10b98120",
    color: "#10b981",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  completeButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  completedButton: {
    background: "#10b981",
    cursor: "not-allowed",
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #1e293b",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  navigation: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },
  navButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.5rem",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  navButtonPrimary: {
    background: "#6366f1",
    borderColor: "#6366f1",
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #1e293b",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.25rem",
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "2px solid transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  activeTab: {
    color: "#6366f1",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "2px solid #6366f1",
  },
  tabContent: {
    minHeight: "300px",
  },
  overviewContent: {},
  contentTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "1rem",
  },
  contentText: {
    fontSize: "0.9375rem",
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginBottom: "1.5rem",
  },
  contentSubtitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: "0.75rem",
  },
  resourcesList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  resourceLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1rem",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
  },
  resourceIcon: {
    fontSize: "1.25rem",
  },
  actionBtnActive: {
    background: "#6366f120",
    borderColor: "#6366f1",
    color: "#6366f1",
  },
  commentItem: {
    padding: "1rem",
    background: "#1e293b",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #334155",
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  commentAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "0.875rem",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#f1f5f9",
  },
  commentDate: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.125rem",
  },
  deleteCommentBtn: {
    padding: "0.25rem",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "0.25rem",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  commentText: {
    fontSize: "0.875rem",
    color: "#cbd5e1",
    lineHeight: "1.6",
    margin: 0,
  },
  notesContent: {},
  notesTextarea: {
    width: "100%",
    minHeight: "200px",
    padding: "1rem",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "1rem",
  },
  saveNotesBtn: {
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  discussionContent: {},
  commentBox: {
    marginBottom: "2rem",
  },
  commentInput: {
    width: "100%",
    minHeight: "100px",
    padding: "1rem",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "0.75rem",
  },
  postCommentBtn: {
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  commentsSection: {
    paddingTop: "1.5rem",
    borderTop: "1px solid #1e293b",
  },
  noComments: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.875rem",
    padding: "2rem",
  },
  sidebar: {
    width: "380px",
    background: "#1e293b",
    borderLeft: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #334155",
  },
  sidebarTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: 0,
  },
  closeSidebar: {
    padding: "0.25rem",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  lecturesList: {
    flex: 1,
    overflow: "auto",
    padding: "0.5rem",
  },
  lectureItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    marginBottom: "0.5rem",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeLectureItem: {
    background: "#6366f120",
    borderColor: "#6366f1",
  },
  lectureItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
  },
  lectureItemNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  lectureItemTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#e2e8f0",
    marginBottom: "0.25rem",
  },
  lectureItemDuration: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.75rem",
    color: "#64748b",
  },
  lectureItemRight: {
    marginLeft: "0.5rem",
  },
};

export default WatchLecture;
