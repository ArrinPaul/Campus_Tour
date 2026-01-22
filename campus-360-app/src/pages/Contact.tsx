import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Campus Address',
      info: 'Kanmanike, Kumbalgodu, Mysore Road, Bangalore, Karnataka - 560074',
      link: 'https://maps.google.com/?q=Christ+University+Kengeri+Campus',
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      info: '080 62689800 / 9828 / 9820 / 9800',
      link: 'tel:08062689800',
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      info: 'admissions.kengeri@christuniversity.in',
      info2: 'office.kengeri@christuniversity.in',
      link: 'mailto:admissions.kengeri@christuniversity.in',
    },
    {
      icon: Globe,
      title: 'Website',
      info: 'bkc.christuniversity.in',
      link: 'https://bkc.christuniversity.in',
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
            Contact Us
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              marginBottom: '48px',
              maxWidth: '700px',
            }}
          >
            Get in touch with CHRIST (Deemed to be University) Kengeri Campus for admissions,
            queries, or any information about our programs.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '60px',
            }}
          >
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <motion.a
                  key={index}
                  href={contact.link}
                  target={contact.link?.startsWith('http') ? '_blank' : undefined}
                  rel={contact.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    padding: '28px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    display: 'block',
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
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={24} color="#10b981" />
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    {contact.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      lineHeight: 1.6,
                      marginBottom: contact.info2 ? '6px' : '0',
                    }}
                  >
                    {contact.info}
                  </p>

                  {contact.info2 && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#64748b',
                        lineHeight: 1.6,
                      }}
                    >
                      {contact.info2}
                    </p>
                  )}
                </motion.a>
              );
            })}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px',
                }}
              >
                Send us a Message
              </h2>

              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px',
                }}
              >
                Visit Us
              </h2>

              <div
                style={{
                  backgroundColor: 'white',
                  padding: '32px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
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
                  Main Office
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    lineHeight: 1.8,
                    marginBottom: '20px',
                  }}
                >
                  CHRIST (Deemed to be University)
                  <br />
                  Bangalore Kengeri Campus
                  <br />
                  Kanmanike, Kumbalgodu
                  <br />
                  Mysore Road, Bangalore
                  <br />
                  Karnataka - 560074
                </p>
                <a
                  href="https://maps.google.com/?q=Christ+University+Kengeri+Campus"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#10b981',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>

              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  padding: '24px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #10b981',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  Office Hours
                </h4>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: 1.6,
                  }}
                >
                  Monday - Friday: 9:00 AM - 5:00 PM
                  <br />
                  Saturday: 9:00 AM - 1:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
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
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {[
              {
                q: 'What programs are offered at Kengeri Campus?',
                a: 'Kengeri Campus offers B.Tech, M.Tech, MBA, BBA, B.Com, B.Arch, and various science programs through its schools of Engineering, Business, Architecture, and Sciences.',
              },
              {
                q: 'Is hostel accommodation available?',
                a: 'Yes, separate hostel facilities for boys and girls are available on campus with modern amenities, mess facilities, and 24/7 security.',
              },
              {
                q: 'How can I apply for admission?',
                a: 'Applications can be submitted online through the Christ University admissions portal. Visit christuniversity.in/admissions for details and deadlines.',
              },
              {
                q: 'Is transportation provided from the city?',
                a: 'Yes, the university provides bus services from various points in Bangalore. Private buses and BMTC services also connect to the campus.',
              },
              {
                q: 'What are the placement opportunities?',
                a: 'The Training and Placement Cell facilitates campus placements with top companies. Engineering graduates have been placed in companies like TCS, Infosys, Wipro, and more.',
              },
            ].map((faq, i) => (
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
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  {faq.q}
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{faq.a}</p>
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
            Connect With Us
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { name: 'Facebook', url: 'https://www.facebook.com/ChristUniversity/' },
              { name: 'Instagram', url: 'https://www.instagram.com/christuniversity_official/' },
              { name: 'Twitter', url: 'https://twitter.com/ChristUni_India' },
              { name: 'LinkedIn', url: 'https://www.linkedin.com/school/christ-university/' },
              { name: 'YouTube', url: 'https://www.youtube.com/c/ChristUniversity' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#0f172a',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.color = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
              >
                {social.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
