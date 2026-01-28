import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Campus = () => {
  const locations = [
    {
      name: 'Faculty of Engineering',
      description:
        'CUFE - State-of-the-art engineering programs with modern labs and workshops. Started in 2009 to promote quality technical education.',
      area: 'Academic Block',
    },
    {
      name: 'School of Business & Management',
      description:
        'Business and Management programs with industry connections and modern learning facilities.',
      area: 'Academic Block',
    },
    {
      name: 'Christ PU College',
      description: 'Pre-university residential college on campus providing quality education.',
      area: 'Residential Campus',
    },
    {
      name: 'Sports Complex',
      description:
        'Modern playgrounds and comprehensive sports facilities for various indoor and outdoor sports.',
      area: 'Sports & Recreation',
    },
    {
      name: 'Campus Grounds',
      description: '78.5 acres of lush green environment providing holistic learning atmosphere.',
      area: 'Open Spaces',
    },
    {
      name: 'Academic Facilities',
      description:
        'Lecture halls, laboratories, research centers with cutting-edge equipment and technology.',
      area: 'Learning Centers',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '80px 60px 120px 60px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}
          >
            Kengeri Campus Locations
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              marginBottom: '24px',
              maxWidth: '700px',
            }}
          >
            Explore our 78.5-acre lush green campus located at Kanmanike, Kumbalgodu, Mysore Road.
            Our modern facilities support excellence in engineering and business education.
          </p>

          <p
            style={{
              fontSize: '16px',
              color: '#0ea5e9',
              marginBottom: '48px',
              fontWeight: 500,
            }}
          >
            Kanmanike, Kumbalgodu, Mysore Road, Bangalore, Karnataka - 560074
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  padding: '32px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <MapPin size={24} color="#0ea5e9" />
                </div>

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  {location.name}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#0ea5e9',
                    marginBottom: '12px',
                    fontWeight: 500,
                  }}
                >
                  {location.area}
                </p>

                <p
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    lineHeight: 1.6,
                  }}
                >
                  {location.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              marginTop: '60px',
              padding: '32px',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              borderLeft: '4px solid #0ea5e9',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '12px',
              }}
            >
              About Kengeri Campus
            </h3>
            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                lineHeight: 1.8,
                marginBottom: '12px',
              }}
            >
              Located about 25 kilometers from the Central Campus, 10 kilometers from Bangalore
              University, and 8 kilometers from R V College of Engineering towards Mysore Road.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                lineHeight: 1.8,
              }}
            >
              For more information, visit:{' '}
              <a
                href="https://bkc.christuniversity.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 500 }}
              >
                bkc.christuniversity.in
              </a>
            </p>
          </div>

          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: '60px',
              marginBottom: '24px',
            }}
          >
            Campus Facilities
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            {[
              {
                title: 'Central Library',
                desc: 'Well-equipped library with over 50,000 books, journals, e-resources, and digital archives.',
                icon: '📚',
              },
              {
                title: 'Computer Labs',
                desc: 'State-of-the-art computing facilities with high-speed internet and latest software.',
                icon: '💻',
              },
              {
                title: 'Research Centers',
                desc: 'Advanced research facilities for engineering, sciences, and interdisciplinary studies.',
                icon: '🔬',
              },
              {
                title: 'Auditorium',
                desc: 'Modern auditorium with 1000+ seating capacity for events and conferences.',
                icon: '🎭',
              },
              {
                title: 'Cafeteria',
                desc: 'Spacious dining facilities serving nutritious vegetarian meals throughout the day.',
                icon: '🍽️',
              },
              {
                title: 'Health Center',
                desc: '24/7 medical facility with qualified doctors and first-aid services.',
                icon: '🏥',
              },
              {
                title: 'Hostel Accommodation',
                desc: 'Separate hostels for boys and girls with modern amenities and 24/7 security.',
                icon: '🏠',
              },
              {
                title: 'WiFi Campus',
                desc: 'Entire campus covered with high-speed wireless internet connectivity.',
                icon: '📶',
              },
            ].map((facility, i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{facility.icon}</div>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  {facility.title}
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                  {facility.desc}
                </p>
              </div>
            ))}
          </div>

          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: '48px',
              marginBottom: '24px',
            }}
          >
            How to Reach
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div
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
                  marginBottom: '12px',
                }}
              >
                From Bangalore City
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>
                - 25 km from Christ University Central Campus (Hosur Road)
                <br />
                - 10 km from Bangalore University
                <br />
                - 8 km from R V College of Engineering
                <br />- Located on Mysore Road, near Kumbalgodu
              </p>
            </div>
            <div
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
                  marginBottom: '12px',
                }}
              >
                Public Transport
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>
                - BMTC buses available from Majestic, Kengeri
                <br />
                - Nearest Metro: Kengeri Metro Station
                <br />
                - Regular campus shuttle services
                <br />- Auto-rickshaws available from Kumbalgodu Junction
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
