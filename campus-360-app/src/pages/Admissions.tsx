import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Admissions = () => {
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
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}
          >
            Admissions
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              marginBottom: '24px',
              maxWidth: '700px',
            }}
          >
            CHRIST (Deemed to be University) welcomes students who seek excellence and holistic
            development. Our admission process is designed to identify passionate learners ready to
            contribute to society.
          </p>

          <p
            style={{
              fontSize: '16px',
              color: '#10b981',
              marginBottom: '48px',
              fontWeight: 500,
            }}
          >
            Email: admissions.kengeri@christuniversity.in | Phone: 080 62689800
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '60px',
            }}
          >
            {[
              {
                icon: FileText,
                title: 'Online Application',
                description:
                  'Apply online through the official CHRIST University portal for UG/PG programs including B.Tech, MBA, and other courses.',
                action: 'Apply Now',
              },
              {
                icon: Calendar,
                title: 'CUET Entrance',
                description:
                  'CHRIST University Entrance Test (CUET) conducted for various programs. Check important dates and session schedules.',
                action: 'View Dates',
              },
              {
                icon: Users,
                title: 'Eligibility Criteria',
                description:
                  'Program-specific eligibility requirements for B.Tech, MBA, and other undergraduate and postgraduate courses.',
                action: 'Check Eligibility',
              },
              {
                icon: CheckCircle,
                title: 'Selection Process',
                description:
                  'Based on entrance test scores, academic records, skill assessment, and personal interviews.',
                action: 'Learn More',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    padding: '28px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#10b981';
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
                      backgroundColor: '#ecfdf5',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} color="#10b981" />
                  </div>

                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '12px',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      lineHeight: 1.7,
                      marginBottom: '20px',
                    }}
                  >
                    {item.description}
                  </p>

                  <a
                    href="https://christuniversity.in/apply-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item.action} →
                  </a>
                </motion.div>
              );
            })}
          </div>

          <div
            style={{
              backgroundColor: 'white',
              padding: '48px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '40px',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '24px',
              }}
            >
              Admission Process
            </h2>

            <ol
              style={{
                fontSize: '16px',
                color: '#64748b',
                lineHeight: 2.2,
                paddingLeft: '24px',
              }}
            >
              <li>
                <strong style={{ color: '#0f172a' }}>Register Online:</strong> Visit{' '}
                <a
                  href="https://christuniversity.in/apply-online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#10b981', textDecoration: 'none' }}
                >
                  christuniversity.in/apply-online
                </a>{' '}
                and complete the registration form
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Submit Documents:</strong> Upload required
                documents and pay the application fee online
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>CUET Entrance Test:</strong> Appear for CHRIST
                University Entrance Test at designated centers
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Skill Assessment:</strong> Attend skill
                assessment and personal interview (program-specific)
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Check Status:</strong> Monitor your application
                status regularly through the online portal
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Admission Confirmation:</strong> Complete
                admission formalities and fee payment upon selection
              </li>
            </ol>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecfdf5',
                padding: '32px',
                borderRadius: '12px',
                borderLeft: '4px solid #10b981',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '16px',
                }}
              >
                Programs Available
              </h3>
              <ul
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  lineHeight: 1.8,
                  paddingLeft: '20px',
                }}
              >
                <li>Bachelor of Technology (B.Tech) - Various specializations</li>
                <li>Master of Business Administration (MBA)</li>
                <li>Bachelor of Commerce (B.Com)</li>
                <li>Postgraduate Programs (PG)</li>
                <li>Doctoral Programs (PhD)</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: '#fef3c7',
                padding: '32px',
                borderRadius: '12px',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '16px',
                }}
              >
                Important Links
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  fontSize: '15px',
                }}
              >
                <li style={{ marginBottom: '12px' }}>
                  <a
                    href="https://christuniversity.in/apply-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}
                  >
                    → Online Application Portal
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a
                    href="https://christuniversity.in/application-status"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}
                  >
                    → Check Application Status
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a
                    href="https://christuniversity.in/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}
                  >
                    → FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="https://christuniversity.in/student-accommodation"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}
                  >
                    → Student Accommodation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '16px',
              }}
            >
              Need Help with Admissions?
            </h3>
            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                marginBottom: '24px',
              }}
            >
              Our admissions team is here to assist you with any queries
            </p>
            <div
              style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <a
                href="mailto:admissions.kengeri@christuniversity.in"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
              >
                Email Us
              </a>
              <a
                href="tel:08062689800"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#10b981',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#10b981';
                }}
              >
                Call Us
              </a>
            </div>
          </div>

          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#0f172a',
              marginTop: '60px',
              marginBottom: '24px',
            }}
          >
            Scholarships & Financial Aid
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {[
              {
                title: 'Merit Scholarships',
                desc: 'Based on academic performance in qualifying examinations. Up to 100% tuition waiver for top performers.',
                eligibility: 'Students with 90%+ in Class 12',
              },
              {
                title: 'Sports Scholarships',
                desc: 'For students excelling in sports at state, national, or international levels.',
                eligibility: 'State/National level sports achievers',
              },
              {
                title: 'Need-Based Aid',
                desc: 'Financial assistance for economically disadvantaged students with strong academic records.',
                eligibility: 'Based on family income criteria',
              },
            ].map((scholarship, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h4
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#10b981',
                    marginBottom: '12px',
                  }}
                >
                  {scholarship.title}
                </h4>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                  }}
                >
                  {scholarship.desc}
                </p>
                <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                  Eligibility: {scholarship.eligibility}
                </p>
              </div>
            ))}
          </div>

          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#0f172a',
              marginTop: '48px',
              marginBottom: '24px',
            }}
          >
            Why Choose CHRIST Kengeri?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { icon: '🎓', text: 'NAAC A++ Accredited University' },
              { icon: '🏆', text: 'NBA Accredited Engineering Programs' },
              { icon: '🌿', text: '78.5 Acres Lush Green Campus' },
              { icon: '💼', text: 'Strong Industry Connections & Placements' },
              { icon: '🔬', text: 'State-of-the-art Research Facilities' },
              { icon: '🌍', text: 'International Exchange Programs' },
              { icon: '🏠', text: 'On-campus Hostel Accommodation' },
              { icon: '🚌', text: 'Transport Facilities from City' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
