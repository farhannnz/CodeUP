import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

const CourseCard = ({ id, image, name, price, instructor, rating, students, duration }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={image} alt={name} style={styles.image} />
        <div style={styles.badge}>
          {price === "Free" || price === "Enrolled" ? (
            <span style={styles.freeBadge}>{price}</span>
          ) : (
            <span style={styles.priceBadge}>₹{price}</span>
          )}
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{name}</h3>
        
        {instructor && (
          <p style={styles.instructor}>By {instructor}</p>
        )}

        <div style={styles.meta}>
          {rating && (
            <div style={styles.metaItem}>
              <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              <span>{rating}</span>
            </div>
          )}
          {students && (
            <div style={styles.metaItem}>
              <Users size={16} />
              <span>{students}</span>
            </div>
          )}
          {duration && (
            <div style={styles.metaItem}>
              <Clock size={16} />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <Link to={`/course/${id}`} style={styles.button}>
          <span>View Course</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
  freeBadge: {
    background: '#10b981',
    color: 'white',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  priceBadge: {
    background: 'white',
    color: '#0f172a',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '700',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  content: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  instructor: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
  },
};

export default CourseCard;
