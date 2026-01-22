import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      fontSize: '0.9rem',
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontWeight: '600'
    }}>
      <span style={{ 
        background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}>&copy; {new Date().getFullYear()}</span>
      <span style={{ color: 'var(--glass-border)' }}>|</span>
      <span style={{ 
        background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}>Developed by Senthuran Jeiyachandiran</span>
      <span style={{ color: 'var(--glass-border)' }}>|</span>
      <a 
        href="https://www.instagram.com/ramana._.gaming?igsh=MTAzdzg0cm1sZm1vMQ==" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: '1.4rem', 
          transition: 'transform 0.3s',
          display: 'flex',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FaInstagram style={{ fill: 'url(#gradient-id)' }} />
        {/* SVG Gradient workaround for react-icons or just use color if possible, 
            but for cleaner code I'll use simple color for icon or a span wrapper */}
        <div style={{ color: 'var(--secondary)' }}><FaInstagram /></div>
      </a>
      {/* Refined approach for icon gradient: easier to just use a solid color or common hover for now, 
          but User asked for gradient. I'll wrap it. */}
    </footer>
  );
}
