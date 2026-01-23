import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';



export default function AdminPage({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'birthday') {
      setIsAuthenticated(true);
      toast.success('Welcome Admin!');
    } else {
      toast.error('Invalid Username or Password');
      shakeForm();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/', { replace: true });
    toast.info('Logged out successfully');
  };

  // Simple shake effect state
  const [shake, setShake] = useState(false);
  const shakeForm = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };
  
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const [startTime, setStartTime] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim() || !message.trim() || !startTime) {
      toast.warn('Please fill in all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.toUpperCase());
    formData.append('message', message);
    formData.append('startTime', startTime);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/wish`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Show loading for at least 2 seconds for the effect
        setTimeout(() => {
          setIsLoading(false);
          toast.success('Wish Scheduled Successfully!');
          navigate('/');
        }, 1000);
      } else {
        setIsLoading(false);
        toast.error(data.error || 'Failed to save wish');
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error('An error occurred while communicating with the server.');
    }
  };

  if (isLoading) return <Loading />;

  if (isAuthenticated) {
    return (
      <div className="page-container">
        <motion.div 
          className="glass" 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>Schedule a BD Wish</h1>
      
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            {/* ... form fields ... */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                Birthday Person Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="E.G. JOHN DOE"
                style={{  
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white',
                  outline: 'none',
                  textTransform: 'uppercase'
                }} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                Birthday Wish Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your special message..."
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white',
                  outline: 'none',
                  resize: 'none'
                }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>Upload Photo (Optional)</label>
              <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'inline-block',
                  width: '100%'
              }}>
                <input 
                    id="photo-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        background: 'rgba(0,0,0,0.3)', 
                        color: 'white',
                        cursor: 'pointer'
                    }} 
                />
              </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                    Start Time (Duration: 1 hr) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type="datetime-local" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        style={{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            borderRadius: '0.5rem', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            background: 'rgba(255,255,255,0.05)', 
                            color: 'white',
                            outline: 'none',
                            colorScheme: 'dark',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }} 
                    />
                </div>
            </div>
            
            <button type="submit" className="btn">Schedule Wish</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div 
        className="glass" 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src="/BD wish.png" 
            alt="Logo" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: '120px',
              display: 'block',
              margin: '0 auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.6))'
            }} 
          />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter 'admin'"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s'
              }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 'birthday'"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white',
                outline: 'none'
              }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <button type="submit" className="btn" style={{ marginTop: '0.5rem', width: '100%' }}>Login</button>
        </form>
      </motion.div>
    </div>
  );
}
