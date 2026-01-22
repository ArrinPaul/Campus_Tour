import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '80px 60px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10b981',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '40px',
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '24px',
              letterSpacing: '-1px',
            }}
          >
            About CHRIST (Deemed to be University)
          </h1>

          <div
            style={{
              fontSize: '18px',
              lineHeight: 1.8,
              color: '#64748b',
              maxWidth: '800px',
            }}
          >
            <p style={{ marginBottom: '20px' }}>
              Welcome to the CHRIST (Deemed to be University) Bangalore Kengeri Campus virtual tour.
              Explore our world-class facilities, infrastructure, and the vibrant environment that
              makes us one of India's leading educational institutions.
            </p>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '40px',
                marginBottom: '16px',
              }}
            >
              Our Vision
            </h2>
            <p
              style={{
                marginBottom: '20px',
                fontSize: '20px',
                fontWeight: 600,
                color: '#10b981',
              }}
            >
              EXCELLENCE AND SERVICE
            </p>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '40px',
                marginBottom: '16px',
              }}
            >
              Our Mission
            </h2>
            <p style={{ marginBottom: '20px' }}>
              CHRIST (Deemed to be University) is a nurturing ground for an individual's holistic
              development to make effective contribution to the society in a dynamic environment.
            </p>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '40px',
                marginBottom: '16px',
              }}
            >
              Kengeri Campus
            </h2>
            <p style={{ marginBottom: '20px' }}>
              Kengeri Campus is a lush green land of 78.5 acres situated about 25 kilometers away
              from the Central Campus, 10 kilometers from Bangalore University and 8 kilometers from
              R V College of Engineering towards Mysore Road. This modern campus with play grounds
              and other sportive facilities is the hub of Educational Institutions including Christ
              PU College - Residential, CHRIST (Deemed to be University) Faculty of Engineering, and
              CHRIST (Deemed to be University) School of Business and Management.
            </p>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '40px',
                marginBottom: '16px',
              }}
            >
              Campus Highlights
            </h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>78.5 acres of lush green campus</li>
              <li style={{ marginBottom: '12px' }}>State-of-the-art Faculty of Engineering</li>
              <li style={{ marginBottom: '12px' }}>School of Business and Management</li>
              <li style={{ marginBottom: '12px' }}>Modern playgrounds and sports facilities</li>
              <li style={{ marginBottom: '12px' }}>Holistic learning environment beyond books</li>
              <li style={{ marginBottom: '12px' }}>
                Focus on character building and ethical values
              </li>
            </ul>

            <p
              style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#ecfdf5',
                borderLeft: '4px solid #10b981',
                borderRadius: '8px',
                fontStyle: 'italic',
              }}
            >
              At CUFE-Kengeri, learning is not just a series of instructions but a passion, which
              goes beyond books, beyond instructions, beyond horizons. Here, we enable students to
              learn by capturing experiences and exploring new realms of wisdom.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
