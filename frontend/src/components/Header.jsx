import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Header({ isAuthenticated, setIsAuthenticated }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHeaderLogout = () => {
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
    navigate('/', { replace: true });
  };

  const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const d = pad(date.getDate());
    const m = pad(date.getMonth() + 1);
    const y = date.getFullYear();
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${d}-${m}-${y}  ${h}:${min}:${s}`;
  };

  const isAdminPage = location.pathname === '/admin';
  const showLogout = isAdminPage && isAuthenticated;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 1000,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        backgroundColor: 'rgba(15, 23, 42, 0.6)'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src="/BD wish.png" 
          alt="BD Wish Logo" 
          style={{ 
            width: '200px', 
            height: '150px', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.5))'
          }} 
        />
        <span className="display-desktop" style={{ 
          fontSize: '2.4rem', 
          fontWeight: '800', 
          letterSpacing: '1px',
          background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 70%, #000000 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block'
        }}>BD Wisher</span>
      </Link>
      
      {/* Centered Time Clock - Digital Style */}
      <div style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          textAlign: 'center',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.2rem',
          fontWeight: '700',
          letterSpacing: '2px',
          background: 'linear-gradient(to right, #4ade80, #22d3ee)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'none', 
        }} className="header-clock">
          {formatDate(currentTime)}
      </div>

       <div className='desktop-only' style={{ 
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.4rem', 
          fontWeight: '700',
          letterSpacing: '2px',
          background: 'linear-gradient(to right, #4ade80, #22d3ee)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
       }}>
         {formatDate(currentTime)}
       </div>

      <nav>
        {showLogout ? (
          <button 
            onClick={handleHeaderLogout}
            style={{ 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: 600, 
              padding: '0.6rem 1.5rem', 
              borderRadius: '9999px', 
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/admin" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: 600, 
              padding: '0.6rem 1.5rem', 
              borderRadius: '9999px', 
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <span>Admin</span>
          </Link>
        )}
      </nav>
      {/* Add style for responsive clock and text hiding */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only, .display-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
           .desktop-only {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;
              white-space: nowrap;
           }
        }
      `}</style>
    </motion.header>
  );
}
