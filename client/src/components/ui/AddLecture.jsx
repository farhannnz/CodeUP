import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { Video, ArrowLeft, Plus, CheckCircle, AlertCircle, Link, X, FileText } from "lucide-react";

const AddLecture = () => {
  const { Courseid } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [resources, setResources] = useState([{ title: "", url: "", type: "link" }]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const addResource = () => {
    setResources([...resources, { title: "", url: "", type: "link" }]);
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index, field, value) => {
    const newResources = [...resources];
    newResources[index][field] = value;
    setResources(newResources);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!token) {
      setError("Please login first!");
      setLoading(false);
      navigate("/login");
      return;
    }

    if (!lectureTitle.trim() || !videoUrl.trim()) {
      setError("Lecture title and video URL are required.");
      setLoading(false);
      return;
    }

    try {
      new URL(videoUrl);
    } catch {
      setError("Please enter a valid video URL");
      setLoading(false);
      return;
    }

    try {
      const lectureData = {
        lectureTitle: lectureTitle.trim(),
        videoUrl: videoUrl.trim(),
        description: description.trim(),
        duration: duration.trim(),
        isPreviewFree,
        resources: resources.filter(r => r.title && r.url)
      };

      const response = await axios.post(
        `https://codeup-ql59.onrender.com/add-lecture/${Courseid}`,
        lectureData,
        {
          headers: {
            "Content-Type": "application/json",  
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Lecture added successfully!");
        
        setLectureTitle("");
        setVideoUrl("");
        setDescription("");
        setDuration("");
        setIsPreviewFree(false);
        setResources([{ title: "", url: "", type: "link" }]);
        
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Failed to add lecture. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/admin")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1 style={styles.title}>Add New Lecture</h1>
        <p style={styles.subtitle}>Add a video lecture to your course</p>
      </div>

      <div style={styles.content}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.iconContainer}>
              <Video size={24} />
            </div>
            <div>
              <h2 style={styles.formTitle}>Lecture Details</h2>
              <p style={styles.formSubtitle}>Course ID: {Courseid}</p>
            </div>
          </div>

          {message && (
            <div style={styles.successMessage}>
              <CheckCircle size={20} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Video size={18} />
                <span>Lecture Title *</span>
              </label>
              <input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="Enter lecture title"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Link size={18} />
                <span>Video URL *</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={styles.input}
                required
              />
              <p style={styles.helpText}>
                Supported: YouTube, Vimeo, or direct video links
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FileText size={18} />
                <span>Lecture Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn in this lecture..."
                style={styles.textarea}
                rows={4}
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span>⏱️</span>
                  <span>Duration</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 15:30"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isPreviewFree}
                    onChange={(e) => setIsPreviewFree(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span>🔓 Free Preview</span>
                </label>
                <p style={styles.helpText}>
                  Allow non-enrolled students to watch this lecture
                </p>
              </div>
            </div>

            {/* Resources Section */}
            <div style={styles.resourcesSection}>
              <div style={styles.resourcesHeader}>
                <h3 style={styles.resourcesTitle}>Lecture Resources</h3>
                <button type="button" style={styles.addResourceBtn} onClick={addResource}>
                  <Plus size={16} />
                  <span>Add Resource</span>
                </button>
              </div>
              
              {resources.map((resource, index) => (
                <div key={index} style={styles.resourceItem}>
                  <div style={styles.resourceInputs}>
                    <input
                      type="text"
                      placeholder="Resource title"
                      value={resource.title}
                      onChange={(e) => updateResource(index, 'title', e.target.value)}
                      style={styles.resourceInput}
                    />
                    <input
                      type="url"
                      placeholder="Resource URL"
                      value={resource.url}
                      onChange={(e) => updateResource(index, 'url', e.target.value)}
                      style={styles.resourceInput}
                    />
                    <select
                      value={resource.type}
                      onChange={(e) => updateResource(index, 'type', e.target.value)}
                      style={styles.resourceSelect}
                    >
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="file">File</option>
                    </select>
                  </div>
                  {resources.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeResourceBtn}
                      onClick={() => removeResource(index)}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  <span>Adding Lecture...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Add Lecture</span>
                </>
              )}
            </button>
          </form>
        </div>

        {(lectureTitle || videoUrl) && (
          <div style={styles.previewCard}>
            <h3 style={styles.previewTitle}>Lecture Preview</h3>
            
            {thumbnailUrl && (
              <div style={styles.videoPreview}>
                <div style={styles.videoThumbnail}>
                  <img src={thumbnailUrl} alt="Video thumbnail" style={styles.thumbnailImg} />
                  <div style={styles.playOverlay}>
                    <Video size={32} />
                  </div>
                  {isPreviewFree && (
                    <div style={styles.freeTag}>FREE</div>
                  )}
                </div>
              </div>
            )}

            <div style={styles.lectureInfo}>
              <h4 style={styles.lectureInfoTitle}>
                {lectureTitle || "Lecture Title"}
              </h4>
              {duration && (
                <p style={styles.lectureDuration}>
                  ⏱️ {duration}
                </p>
              )}
              <p style={styles.lectureDescription}>
                {description || "Lecture description will appear here..."}
              </p>
              {videoUrl && (
                <div style={styles.videoUrlPreview}>
                  <Link size={16} />
                  <span>{videoUrl}</span>
                </div>
              )}
              
              {resources.filter(r => r.title && r.url).length > 0 && (
                <div style={styles.resourcesPreview}>
                  <h5 style={styles.resourcesPreviewTitle}>Resources:</h5>
                  {resources.filter(r => r.title && r.url).map((resource, index) => (
                    <div key={index} style={styles.resourcePreviewItem}>
                      <span>{resource.type === 'pdf' ? '📄' : resource.type === 'file' ? '📎' : '🔗'}</span>
                      <span>{resource.title}</span>
                    </div>
                  ))}
                </div>
              )}
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 2rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "1.5rem",
    transition: "all 0.2s ease",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "white",
    margin: "0 0 0.5rem 0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
    textAlign: "center",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
  },
  formCard: {
    background: "white",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },
  iconContainer: {
    width: "50px",
    height: "50px",
    borderRadius: "0.75rem",
    background: "linear-gradient(135deg, #ec4899, #be185d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  formTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  formSubtitle: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0.25rem 0 0 0",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    border: "1px solid #bbf7d0",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    border: "1px solid #fecaca",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
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
    color: "#374151",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
  },
  input: {
    padding: "0.875rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    color: "#111827",
    outline: "none",
    transition: "all 0.2s ease",
  },
  textarea: {
    padding: "0.875rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    color: "#111827",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#ec4899",
  },
  helpText: {
    fontSize: "0.75rem",
    color: "#64748b",
    margin: 0,
  },
  resourcesSection: {
    marginTop: "1rem",
    padding: "1.5rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
  },
  resourcesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  resourcesTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  addResourceBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  resourceItem: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  resourceInputs: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "2fr 3fr 1fr",
    gap: "0.75rem",
  },
  resourceInput: {
    padding: "0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    color: "#111827",
    outline: "none",
  },
  resourceSelect: {
    padding: "0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    color: "#111827",
    outline: "none",
    background: "white",
    cursor: "pointer",
  },
  removeResourceBtn: {
    padding: "0.5rem",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #ec4899, #be185d)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "1rem",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  previewCard: {
    background: "white",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
  },
  previewTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 1.5rem 0",
  },
  videoPreview: {
    marginBottom: "1.5rem",
  },
  videoThumbnail: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    borderRadius: "0.5rem",
    overflow: "hidden",
    background: "#f1f5f9",
  },
  thumbnailImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  playOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  freeTag: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.375rem 0.75rem",
    background: "#10b981",
    color: "white",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  lectureInfo: {},
  lectureInfoTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  lectureDuration: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0 0 1rem 0",
  },
  lectureDescription: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: "1.6",
    margin: "0 0 1rem 0",
  },
  videoUrlPreview: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    color: "#64748b",
    wordBreak: "break-all",
  },
  resourcesPreview: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "0.5rem",
  },
  resourcesPreviewTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 0.75rem 0",
  },
  resourcePreviewItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
    marginBottom: "0.5rem",
  },
};

export default AddLecture;
