import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { Filter, Grid, List } from "lucide-react";

const CourseList = () => {
  const [course_list, setCourse_list] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchCourseData = async () => {
      try {
        const response = await axios.get("https://codeup-ql59.onrender.com/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse_list(response.data.courses || []);
        setFilteredCourses(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourse_list([]);
        setFilteredCourses([]);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [navigate]);

  const categories = ["All", ...new Set((course_list || []).map(course => course?.category).filter(Boolean))];

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredCourses(course_list);
    } else {
      setFilteredCourses(course_list.filter(course => course.category === category));
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading courses...</p>
      </div>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Explore Courses</h2>
            <p style={styles.subtitle}>
              Choose from {course_list.length} courses to advance your career
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div style={styles.filterContainer}>
          <div style={styles.filterLabel}>
            <Filter size={20} />
            <span>Filter by category:</span>
          </div>
          <div style={styles.categoryButtons}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                style={{
                  ...styles.categoryBtn,
                  ...(selectedCategory === category && styles.categoryBtnActive)
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📚</div>
            <h3 style={styles.emptyTitle}>No courses found</h3>
            <p style={styles.emptyText}>Try selecting a different category</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                image={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                name={course.title}
                price={course.Price || "Free"}
                instructor="Expert Instructor"
                rating="4.8"
                students="1.2k"
                duration="8 weeks"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '4rem 1rem',
    background: '#f8fafc',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '0.5rem',
  },
  filterContainer: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '1rem',
  },
  categoryButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  categoryBtn: {
    padding: '0.5rem 1rem',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryBtnActive: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    borderColor: 'transparent',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
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
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#64748b',
  },
};

export default CourseList;
