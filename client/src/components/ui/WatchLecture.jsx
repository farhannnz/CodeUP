import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const WatchLecture = () => {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/lectures/${lectureId}`);
        setLecture(response.data.lecture);

        const savedProgress = Cookies.get(`progress_${lectureId}`);
        if (savedProgress) {
          setProgress(parseFloat(savedProgress));
        }
      } catch (err) {
        setError("Error fetching the lecture.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId]);

  const handleProgress = (e) => {
    const iframe = document.getElementById("lectureIframe");
    const duration = iframe?.duration || 100; // fallback
    const currentTime = e?.target?.currentTime || 0;
    const progress = (currentTime / duration) * 100;
    setProgress(progress);
    Cookies.set(`progress_${lectureId}`, progress.toFixed(2), { expires: 7 });
  };

  const handleVideoInteraction = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="cyberpunk-lecture-container">
      {loading ? (
        <div className="loading-container">
          <div className="cyberpunk-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading Lecture...</p>
        </div>
      ) : error ? (
        <motion.div
          className="error-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="error-icon">!</div>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </motion.div>
      ) : lecture ? (
        <motion.div
          className="video-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="video-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="lecture-title">{lecture.lectureTitle}</h2>
            <div className="tech-decorations">
              <div className="tech-circle"></div>
              <div className="tech-line"></div>
            </div>
          </motion.div>

          <motion.div
            className="video-wrapper"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
           
            <iframe
              id="lectureIframe"
              ref={playerRef}
              src={lecture.videoUrl}
              title={lecture.lectureTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </motion.div>

          <motion.div
            className="progress-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              ></motion.div>
            </div>
            <div className="progress-info">
              <span className="progress-percentage">{progress.toFixed(1)}% Completed</span>
              <span className="progress-time">
                {Math.floor((progress / 100) * 45)}:
                {String(Math.floor(((progress / 100) * 45 * 60) % 60)).padStart(2, "0")} / 45:00
              </span>
            </div>
          </motion.div>

          <motion.div
            className="lecture-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="info-pill">
              <span className="info-icon">📝</span>
              <span>Notes</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">💬</span>
              <span>Discussion</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">📚</span>
              <span>Resources</span>
            </div>
          </motion.div>

          <motion.div
            className="course-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button className="nav-button prev">
              <span className="nav-icon">◀</span> Previous Lecture
            </button>
            <button className="nav-button next">
              Next Lecture <span className="nav-icon">▶</span>
            </button>
          </motion.div>
        </motion.div>
      ) : null}

      <style jsx>{`
        :root {
          --neon-blue: #00f3ff;
          --neon-purple: #9d00ff;
          --dark-bg: #0a0a0f;
          --darker-bg: #050508;
          --card-bg: #12151f;
          --text-primary: #e0e0e0;
          --text-secondary: #a0a0a0;
          --accent: #00f3ff;
          --danger: #ff003c;
          --success: #00ff8c;
        }
        
        * {
          box-sizing: border-box;
          font-family: 'Rajdhani', 'Orbitron', sans-serif;
        }
        
        body {
          background-color: var(--dark-bg);
          color: var(--text-primary);
          margin: 0;
          padding: 0;
        }
        
        .cyberpunk-lecture-container {
          background: linear-gradient(135deg, rgba(15,18,26,1) 0%, rgba(10,10,15,1) 100%);
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .video-container {
          width: 100%;
          max-width: 900px;
          background: var(--card-bg);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.1);
          position: relative;
          border: 1px solid rgba(0, 243, 255, 0.2);
        }
        
        .video-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
          animation: scanline 4s linear infinite;
        }
        
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .video-header {
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
          background: linear-gradient(90deg, rgba(18,21,31,0.8) 0%, rgba(22,26,36,0.8) 100%);
          position: relative;
        }
        
        .lecture-title {
          margin: 0;
          font-size: 1.8rem;
          color: var(--text-primary);
          font-weight: 600;
          text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);
          flex: 1;
        }
        
        .tech-decorations {
          display: flex;
          align-items: center;
        }
        
        .tech-circle {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--neon-blue);
          margin-right: 8px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 243, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 243, 255, 0); }
        }
        
        .tech-line {
          height: 2px;
          width: 40px;
          background: linear-gradient(90deg, var(--neon-blue), transparent);
        }
        
        .video-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          background: var(--darker-bg);
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: rgba(10, 10, 15, 0.3);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .video-wrapper:hover .video-overlay {
          opacity: 1;
        }
        
        .play-button {
          width: 70px;
          height: 70px;
          background: rgba(0, 243, 255, 0.2);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
          border: 2px solid var(--neon-blue);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .play-button span {
          color: var(--text-primary);
          font-size: 30px;
        }
        
        .play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.7);
        }
        
        .progress-container {
          padding: 20px 25px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
          border-radius: 3px;
          position: relative;
        }
        
        .progress-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 8px;
          height: 100%;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.8);
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .progress-percentage {
          color: var(--neon-blue);
        }
        
        .lecture-info {
          padding: 20px 25px;
          display: flex;
          gap: 15px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        .info-pill {
          background: rgba(0, 243, 255, 0.08);
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 243, 255, 0.2);
        }
        
        .info-pill:hover {
          background: rgba(0, 243, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .info-icon {
          font-size: 1rem;
        }
        
        .course-navigation {
          display: flex;
          justify-content: space-between;
          padding: 20px 25px;
        }
        
        .nav-button {
          background: rgba(0, 243, 255, 0.08);
          border: 1px solid rgba(0, 243, 255, 0.2);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }
        
        .nav-button:hover {
          background: rgba(0, 243, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .nav-button.prev .nav-icon {
          margin-right: 8px;
        }
        
        .nav-button.next .nav-icon {
          margin-left: 8px;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        
        .cyberpunk-loader {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .cyberpunk-loader span {
          width: 15px;
          height: 15px;
          margin: 0 5px;
          background-color: var(--neon-blue);
          border-radius: 50%;
          animation: loader 1.5s infinite ease-in-out;
        }
        
        .cyberpunk-loader span:nth-child(2) {
          animation-delay: 0.2s;
          background-color: var(--neon-purple);
        }
        
        .cyberpunk-loader span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes loader {
          0%, 100% { transform: scale(0.3); opacity: 0.2; }
          50% { transform: scale(1); opacity: 1; }
        }
        
        .loading-container p {
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          margin-top: 10px;
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: var(--danger);
        }
        
        .error-icon {
          font-size: 3rem;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--danger);
          border-radius: 50%;
          margin-bottom: 20px;
        }
        
        .retry-btn {
          margin-top: 20px;
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--danger);
          padding: 10px 25px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-btn:hover {
          background: rgba(255, 0, 60, 0.1);
          box-shadow: 0 0 15px rgba(255, 0, 60, 0.3);
        }
        
        @media (max-width: 768px) {
          .lecture-title {
            font-size: 1.4rem;
          }
          
          .lecture-info {
            flex-wrap: wrap;
          }
          
          .course-navigation {
            flex-direction: column;
            gap: 15px;
          }
          
          .nav-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default WatchLecture;