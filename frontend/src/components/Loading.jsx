import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--bg-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: 0
      }} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1 
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <img 
          src="/BD wish.png" 
          alt="Loading Logo" 
          style={{ 
            width: '800px', 
            height: '260px', 
            maxWidth: '95vw',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 60px rgba(139, 92, 246, 0.7))'
          }} 
        />
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          height: '4px',
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          borderRadius: '2px',
          marginTop: '2rem'
        }}
      />
      
      <p style={{ 
        marginTop: '1rem', 
        color: 'var(--accent)', 
        letterSpacing: '3px', 
        fontSize: '0.9rem',
        textTransform: 'uppercase'
      }}>
        Loading Celebration...
      </p>
    </div>
  );
};

export default Loading;
