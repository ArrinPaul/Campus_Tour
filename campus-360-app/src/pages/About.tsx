import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '80px 60px 120px 60px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#0ea5e9',
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
                color: '#0ea5e9',
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
                backgroundColor: '#f0f9ff',
                borderLeft: '4px solid #0ea5e9',
                borderRadius: '8px',
                fontStyle: 'italic',
              }}
            >
              At CUFE-Kengeri, learning is not just a series of instructions but a passion, which
              goes beyond books, beyond instructions, beyond horizons. Here, we enable students to
              learn by capturing experiences and exploring new realms of wisdom.
            </p>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '48px',
                marginBottom: '20px',
              }}
            >
              Schools & Departments
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              {[
                {
                  name: 'School of Engineering and Technology',
                  desc: 'Offers B.Tech programs in CSE, ECE, Civil, Mechanical and more with NBA accreditation.',
                },
                {
                  name: 'School of Business and Management',
                  desc: 'MBA and BBA programs with focus on industry-ready skills and placements.',
                },
                {
                  name: 'School of Architecture',
                  desc: 'B.Arch program offering deep insight into built environment through ecological and artistic lenses.',
                },
                {
                  name: 'School of Sciences',
                  desc: 'UG to post-doctoral programs in Chemistry, Physics, Math, Life Sciences, and Computing.',
                },
              ].map((school, i) => (
                <div
                  key={i}
                  style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0ea5e9',
                      marginBottom: '8px',
                    }}
                  >
                    {school.name}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                    {school.desc}
                  </p>
                </div>
              ))}
            </div>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '48px',
                marginBottom: '20px',
              }}
            >
              University Rankings & Accreditations
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {[
                { rank: 'NAAC A++', label: 'Accreditation' },
                { rank: 'QS 1401+', label: 'World Ranking 2026' },
                { rank: 'NIRF Top 50', label: 'India Ranking 2025' },
                { rank: 'NBA', label: 'Engineering Accreditation' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#0ea5e9',
                      marginBottom: '4px',
                    }}
                  >
                    {item.rank}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#0f172a',
                marginTop: '48px',
                marginBottom: '20px',
              }}
            >
              Campus Life
            </h2>
            <p style={{ marginBottom: '20px' }}>
              The Kengeri Campus offers a vibrant campus life with numerous clubs, events, and
              activities. Students participate in cultural fests like Magnovite, technical
              symposiums, sports events, and community outreach programs. The campus provides hostel
              facilities, health services, NCC, sports facilities, and a well-stocked library.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginTop: '32px',
              }}
            >
              {[
                { stat: '38+', label: 'Countries Represented' },
                { stat: '90,000+', label: 'Alumni Network' },
                { stat: '339,053+', label: 'Library Books' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#0ea5e9',
                      marginBottom: '8px',
                    }}
                  >
                    {item.stat}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
