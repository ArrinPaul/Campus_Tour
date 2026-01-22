import { motion } from 'framer-motion';
import { Play, ChevronRight, MapPin, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingProps {
  onStartTour: () => void;
}

export const Landing = ({ onStartTour }: LandingProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#fafafa',
        overflow: 'auto',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 60px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            C
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              CHRIST University
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Deemed to be University</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { name: 'About', path: '/about' },
            { name: 'Campus', path: '/campus' },
            { name: 'Admissions', path: '/admissions' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#525252',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={onStartTour}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
          >
            Start Tour
          </button>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main
        style={{
          height: 'calc(100% - 89px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          alignItems: 'center',
          padding: '0 60px',
          gap: '60px',
        }}
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ maxWidth: '520px' }}
        >
          {/* Small label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#ecfdf5',
              borderRadius: '6px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#059669',
                letterSpacing: '0.3px',
              }}
            >
              Virtual Campus Tour
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#0f172a',
              marginBottom: '20px',
            }}
          >
            Explore Kengeri Campus, <span style={{ color: '#10b981' }}>from anywhere</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#64748b',
              marginBottom: '36px',
              maxWidth: '440px',
            }}
          >
            Take an immersive 360° virtual tour of our 78.5-acre lush green campus. Explore
            world-class facilities, modern infrastructure, and the vibrant learning environment.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartTour}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              <Play size={18} fill="white" />
              Start Virtual Tour
            </motion.button>

            <Link
              to="/campus"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                padding: '16px 8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              View all locations
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            {[
              { number: '78.5', label: 'Acres Campus' },
              { number: '25+', label: 'Tour Locations' },
              { number: '100+', label: 'Programs' },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#10b981',
                    marginBottom: '4px',
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Content - Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            position: 'relative',
            height: '520px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Preview Image Placeholder */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Overlay with campus name */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <MapPin size={20} color="white" />
                <span style={{ fontSize: '14px', color: 'white' }}>Kengeri Campus, Bangalore</span>
              </div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                CHRIST (Deemed to be University)
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>
                Kanmanike, Kumbalgodu, Mysore Road - Karnataka 560074
              </p>
            </div>

            {/* Play button overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartTour}
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}
            >
              <Play size={32} fill="#10b981" color="#10b981" style={{ marginLeft: '4px' }} />
            </motion.button>
          </div>

          {/* Feature badges */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {[
              { icon: Clock, text: '360° View' },
              { icon: Award, text: 'HD Quality' },
            ].map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0f172a',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Icon size={16} color="#10b981" />
                  {badge.text}
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
        }}
      />
    </div>
  );
};
