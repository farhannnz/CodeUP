import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const ViewCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/view-courses/${id}`);
        setCourse(response.data.course);
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
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/enroll-course",
        { courseId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Course successfully enrolled!");
        setCourse({ ...course, enrolled: true });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Enrollment failed!");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyberpunk-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Loading Course Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="error-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-icon">!</div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="cyberpunk-container">
      {course ? (
        <motion.div 
          className="course-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="course-header">
            <motion.div 
              className="header-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="course-title">{course.title}</h2>
              <p className="course-subtitle">{course.subTitle}</p>
            </motion.div>
            
            <motion.div 
              className="price-tag"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              ₹{course.price}
            </motion.div>
          </div>
          
          <motion.div 
            className="thumbnail-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
            <div className="thumbnail-overlay">
              <div className="course-level">{course.courseLevel}</div>
              <div className="course-category">{course.category}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="course-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="course-description">
              <h3>About This Course</h3>
              <p>{course.description}</p>
            </div>
            
            <motion.button
              className={`enroll-button ${course.enrolled ? "enrolled" : ""}`}
              onClick={handlePurchase}
              disabled={course.enrolled}
              whileHover={!course.enrolled ? { scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)" } : {}}
              whileTap={!course.enrolled ? { scale: 0.95 } : {}}
            >
              {course.enrolled ? "Enrolled" : "Enroll Now"}
            </motion.button>
            
            <div className="lectures-section">
              <h3>Course Content</h3>
              <div className="lectures-count">{course.lectures.length} Lectures</div>
              
              <motion.ul className="lectures-list">
                {course.lectures.map((lecture, index) => (
                  <motion.li 
                    key={lecture._id} 
                    className="lecture-item"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="lecture-info">
                      <span className="lecture-number">{index + 1}</span>
                      <p className="lecture-title">{lecture.lectureTitle}</p>
                    </div>
                    <Link to={`/watch-lecture/${lecture._id}`} className="watch-button">
                      <span className="watch-icon">▶</span>
                      Watch
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="no-data">No course data available</div>
      )}
      
      <style jsx>{`
        :root {
          --neon-blue: #00f3ff;
          --neon-purple: #9d00ff;
          --dark-bg: #0a0a0f;
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
        
        .cyberpunk-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
          background: linear-gradient(180deg, rgba(10,10,15,1) 0%, rgba(15,20,30,1) 100%);
          min-height: 100vh;
        }
        
        .course-card {
          background: var(--card-bg);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.1), 0 0 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 30px;
          border: 1px solid rgba(0, 243, 255, 0.1);
          position: relative;
        }
        
        .course-card:before {
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
        
        .course-header {
          padding: 25px 30px;
          background: linear-gradient(90deg, rgba(18,21,31,1) 0%, rgba(33,41,54,1) 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 243, 255, 0.2);
          position: relative;
        }
        
        .header-content {
          flex: 1;
        }
        
        .course-title {
          font-size: 2rem;
          margin: 0;
          color: var(--text-primary);
          font-weight: 600;
          text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);
          letter-spacing: 1px;
        }
        
        .course-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin: 8px 0 0;
          opacity: 0.9;
        }
        
        .price-tag {
          background: rgba(0, 243, 255, 0.1);
          padding: 10px 20px;
          border-radius: 30px;
          color: var(--neon-blue);
          font-size: 1.5rem;
          font-weight: bold;
          border: 1px solid rgba(0, 243, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
        }
        
        .thumbnail-container {
          position: relative;
          height: 250px;
          overflow: hidden;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        .course-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.1) brightness(0.9);
          transition: transform 0.5s ease;
        }
        
        .thumbnail-container:hover .course-thumbnail {
          transform: scale(1.05);
        }
        
        .thumbnail-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(0deg, rgba(18,21,31,0.9) 0%, rgba(18,21,31,0) 100%);
          display: flex;
          justify-content: space-between;
        }
        
        .course-level, .course-category {
          background: rgba(0, 0, 0, 0.6);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid var(--neon-blue);
          color: var(--neon-blue);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .course-content {
          padding: 30px;
        }
        
        .course-description h3 {
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-top: 0;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        
        .course-description h3:after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--neon-blue), transparent);
          margin-left: 15px;
        }
        
        .course-description p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 30px;
        }
        
        .enroll-button {
          background: linear-gradient(90deg, var(--neon-blue) 0%, var(--neon-purple) 100%);
          color: #fff;
          border: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin: 20px auto;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .enroll-button:before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(45deg);
          z-index: 1;
          transition: all 0.6s ease;
          opacity: 0;
        }
        
        .enroll-button:hover:before {
          opacity: 1;
          animation: glitch 2s linear infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(-5px, -5px); }
          60% { transform: translate(5px, 5px); }
          80% { transform: translate(5px, -5px); }
          100% { transform: translate(0); }
        }
        
        .enroll-button.enrolled {
          background: #2a2a3a;
          color: var(--text-secondary);
          box-shadow: none;
          cursor: not-allowed;
        }
        
        .lectures-section {
          margin-top: 30px;
        }
        
        .lectures-section h3 {
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-bottom: 5px;
          display: flex;
          align-items: center;
        }
        
        .lectures-section h3:after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--neon-blue), transparent);
          margin-left: 15px;
        }
        
        .lectures-count {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        
        .lectures-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .lecture-item {
          background: rgba(18, 21, 31, 0.8);
          margin-bottom: 10px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        .lecture-item:hover {
          background: rgba(0, 243, 255, 0.05);
          transform: translateX(5px);
          border-color: rgba(0, 243, 255, 0.3);
        }
        
        .lecture-info {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .lecture-number {
          background: rgba(0, 243, 255, 0.1);
          color: var(--neon-blue);
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-right: 15px;
          font-weight: bold;
          border: 1px solid rgba(0, 243, 255, 0.3);
        }
        
        .lecture-title {
          margin: 0;
          color: var(--text-primary);
        }
        
        .watch-button {
          background: rgba(0, 0, 0, 0.4);
          color: var(--neon-blue);
          text-decoration: none;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 243, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .watch-button:hover {
          background: rgba(0, 243, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }
        
        .watch-icon {
          margin-right: 5px;
          font-size: 0.8rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: var(--dark-bg);
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
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: var(--dark-bg);
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
        
        .no-data {
          text-align: center;
          padding: 50px;
          color: var(--text-secondary);
          font-size: 1.2rem;
          background: var(--card-bg);
          border-radius: 8px;
          border: 1px solid rgba(0, 243, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .course-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .price-tag {
            margin-top: 15px;
            align-self: flex-end;
          }
          
          .thumbnail-container {
            height: 180px;
          }
          
          .course-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewCourse;