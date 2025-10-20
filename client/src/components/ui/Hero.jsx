import React, { useState } from "react";
import { Search, TrendingUp, Users, Award } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Searching for "${searchQuery}"`);
    }
  };

  const stats = [
    { icon: <Users size={24} />, value: "10,000+", label: "Active Students" },
    { icon: <Award size={24} />, value: "500+", label: "Courses" },
    { icon: <TrendingUp size={24} />, value: "95%", label: "Success Rate" },
  ];

  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.badge}>
            <span style={styles.badgeText}>🚀 Start Learning Today</span>
          </div>
          
          <h1 style={styles.title}>
            Master New Skills with
            <span style={styles.gradientText}> Expert-Led Courses</span>
          </h1>
          
          <p style={styles.subtitle}>
            Join thousands of learners advancing their careers with our comprehensive online courses. 
            Learn at your own pace, from anywhere in the world.
          </p>

          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button style={styles.searchButton} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div style={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statItem}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.imageContainer}>
          <div style={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Students learning"
              style={styles.image}
            />
            <div style={styles.floatingCard1}>
              <div style={styles.cardIcon}>📚</div>
              <div>
                <div style={styles.cardTitle}>Interactive Learning</div>
                <div style={styles.cardText}>Hands-on projects</div>
              </div>
            </div>
            <div style={styles.floatingCard2}>
              <div style={styles.cardIcon}>⭐</div>
              <div>
                <div style={styles.cardTitle}>4.9/5 Rating</div>
                <div style={styles.cardText}>From 10k+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
    padding: '4rem 1rem',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '0.5rem 1rem',
    background: 'white',
    borderRadius: '9999px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  badgeText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6366f1',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#0f172a',
    margin: 0,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    lineHeight: '1.7',
    margin: 0,
  },
  searchContainer: {
    marginTop: '1rem',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  searchIcon: {
    color: '#64748b',
    marginLeft: '0.75rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    background: 'transparent',
  },
  searchButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    marginTop: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statIcon: {
    color: '#6366f1',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  imageContainer: {
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '1rem',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  floatingCard1: {
    position: 'absolute',
    top: '10%',
    right: '-10%',
    background: 'white',
    padding: '1rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    animation: 'float 3s ease-in-out infinite',
  },
  floatingCard2: {
    position: 'absolute',
    bottom: '10%',
    left: '-10%',
    background: 'white',
    padding: '1rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    animation: 'float 3s ease-in-out infinite 1.5s',
  },
  cardIcon: {
    fontSize: '1.5rem',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  cardText: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
};

export default Hero;
