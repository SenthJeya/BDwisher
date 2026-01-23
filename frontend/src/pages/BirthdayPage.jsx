import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function BirthdayPage() {
  const location = useLocation();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [data, setData] = useState({ name: '', message: '', photo: null, startTime: null });

  useEffect(() => {
    const fetchWish = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        const res = await fetch(`${apiUrl}/api/getwish`, {
          headers: {
            'x-timezone': userTimeZone
          }
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching wish:', err);
        // Set default empty data on error to avoid breaking the UI
        setData({ name: '', message: '', photo: null, startTime: null });
      }
    };

    fetchWish();
  }, [location.key]); // Refetch when navigation happens

  // Helper to get formatted date "OCT 20"
  const getDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Month short name
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ fontSize: '1.5rem', fontWeight: '400', opacity: 0.8 }}>{month}</span>
        <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{day}</span>
      </div>
    );
  };

  const initial = data.name ? data.name.charAt(0).toUpperCase() : '';
  const dateDisplay = getDateDisplay(data.startTime);

  return (
    <div className="page-container" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      {data.name && <Confetti width={windowSize.width} height={windowSize.height} gravity={0.03} numberOfPieces={300} recycle={true} />}
      
      {!data.name ? (
        <motion.div
          className="glass"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ padding: '4rem', textAlign: 'center', zIndex: 1 }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Check back later!</h1>
          <p style={{ marginTop: '1rem', opacity: 0.7 }}>No active celebrations at the moment.</p>
        </motion.div>
      ) : (
        <div className="split-container">
          {/* Left Box: Image, Date, First Letter */}
          <motion.div
            className="glass split-box"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
              {/* First Letter - Large and Stylized */}
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                style={{ 
                  fontSize: '5rem', 
                  fontWeight: '900', 
                  color: 'white',
                  textShadow: '0 0 30px var(--accent)',
                  background: 'rgba(255,255,255,0.1)',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '20px',
                  border: '2px solid var(--accent)',
                  marginBottom: '0.5rem'
                }}
              >
                {initial}
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {data.photo ? (
                  <motion.img 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    src={data.photo}
                    alt="Birthday"
                    style={{ 
                      width: '260px', 
                      height: '260px', 
                      objectFit: 'cover', 
                      borderRadius: '50%',
                      border: '6px solid var(--accent)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)' 
                    }} 
                  />
                ) : (
                  <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 20px var(--accent))' }}>🎂</div>
                )}
              </motion.div>

              {/* Date */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ 
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '15px',
                  border: '1px solid var(--glass-border)',
                  width: '200px'
                }}
              >
                {dateDisplay}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Box: Message */}
          <motion.div
            className="glass split-box"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ justifyContent: 'flex-start', textAlign: 'left', alignItems: 'flex-start' }}
          >
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', color: 'var(--accent)' }}
            >
              Happy Birthday!
            </motion.h4>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="gradient-text"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem', lineHeight: 1.1 }}
            >
              {data.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ 
                fontSize: '1.25rem', 
                lineHeight: '1.8', 
                color: '#cbd5e1', 
                width: '100%',
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--accent) transparent'
              }}
            >
              {data.message.split('\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}









// import React, { useState, useEffect } from 'react';
// import Confetti from 'react-confetti';
// import { motion } from 'framer-motion';
// import { useLocation } from 'react-router-dom';

// export default function BirthdayPage() {
//   const location = useLocation();

//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Window resize listener
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch wish data
//   useEffect(() => {
//     let mounted = true;

//     const fetchWish = async () => {
//       setIsLoading(true);
//       setError(null);

//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

//       try {
//         const res = await fetch(`${apiUrl}/api/wish`);
        
//         if (!res.ok) {
//           throw new Error(`Server responded with status ${res.status}`);
//         }

//         const fetchedData = await res.json();

//         if (mounted) {
//           setData(fetchedData);
//         }
//       } catch (err) {
//         console.error('Error fetching wish:', err);
//         if (mounted) {
//           setError(err.message || 'Failed to load birthday wish');
//         }
//       } finally {
//         if (mounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchWish();

//     return () => {
//       mounted = false;
//     };
//   }, [location.key]);

//   // Format date helper (OCT 20 style)
//   const getDateDisplay = (dateString) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null;

//     const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
//     const day = date.getDate();

//     return (
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
//         <span style={{ fontSize: '1.5rem', fontWeight: '400', opacity: 0.8 }}>{month}</span>
//         <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{day}</span>
//       </div>
//     );
//   };

//   const initial = data?.name ? data.name.charAt(0).toUpperCase() : '';
//   const dateDisplay = data?.startTime ? getDateDisplay(data.startTime) : null;

//   // ────────────────────────────────────────────────
//   //  RENDERING LOGIC
//   // ────────────────────────────────────────────────

//   if (isLoading) {
//     return (
//       <div className="page-container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <motion.div
//           className="glass"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           style={{ padding: '4rem 6rem', textAlign: 'center' }}
//         >
//           <h2>Loading celebration...</h2>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="page-container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <motion.div
//           className="glass"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           style={{ padding: '4rem', textAlign: 'center', color: '#fca5a5' }}
//         >
//           <h1 style={{ fontSize: '2.8rem' }}>Oops...</h1>
//           <p style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>{error}</p>
//           <p style={{ marginTop: '1rem', opacity: 0.8 }}>
//             Please try again later or check your connection
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (!data || !data.name) {
//     return (
//       <div className="page-container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <motion.div
//           className="glass"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           style={{ padding: '4rem', textAlign: 'center', zIndex: 1 }}
//         >
//           <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Check back later!</h1>
//           <p style={{ marginTop: '1rem', opacity: 0.7 }}>
//             No active celebrations at the moment.
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

//   // ────────────────────────────────────────────────
//   //  MAIN HAPPY PATH – birthday content
//   // ────────────────────────────────────────────────

//   return (
//     <div className="page-container" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
//       {data.name && <Confetti width={windowSize.width} height={windowSize.height} gravity={0.03} numberOfPieces={300} recycle={true} />}

//       <div className="split-container">
//         {/* Left side – avatar / photo / date */}
//         <motion.div
//           className="glass split-box"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           style={{ position: 'relative', overflow: 'hidden' }}
//         >
//           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
//             {/* Initial letter */}
//             <motion.div
//               initial={{ scale: 0, rotate: -20 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
//               style={{
//                 fontSize: '5rem',
//                 fontWeight: '900',
//                 color: 'white',
//                 textShadow: '0 0 30px var(--accent)',
//                 background: 'rgba(255,255,255,0.1)',
//                 width: '100px',
//                 height: '100px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: '20px',
//                 border: '2px solid var(--accent)',
//                 marginBottom: '0.5rem',
//               }}
//             >
//               {initial}
//             </motion.div>

//             {/* Photo or fallback cake */}
//             <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
//               {data.photo ? (
//                 <motion.img
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
//                   src={data.photo}   // ← MOST LIKELY BROKEN RIGHT NOW
//                   // If photo is ObjectId → change to: `${apiUrl}/api/photo/${data.photo}`
//                   // If photo is already a public URL → keep as is
//                   alt="Birthday person"
//                   style={{
//                     width: '260px',
//                     height: '260px',
//                     objectFit: 'cover',
//                     borderRadius: '50%',
//                     border: '6px solid var(--accent)',
//                     boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
//                   }}
//                   onError={(e) => {
//                     e.target.src = 'https://via.placeholder.com/260?text=Photo+Not+Found';
//                     e.target.style.borderColor = '#ef4444';
//                   }}
//                 />
//               ) : (
//                 <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 20px var(--accent))' }}>🎂</div>
//               )}
//             </motion.div>

//             {/* Date display */}
//             {dateDisplay && (
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 style={{
//                   textAlign: 'center',
//                   background: 'rgba(0,0,0,0.2)',
//                   padding: '1rem 2rem',
//                   borderRadius: '15px',
//                   border: '1px solid var(--glass-border)',
//                   width: '200px',
//                 }}
//               >
//                 {dateDisplay}
//               </motion.div>
//             )}
//           </div>
//         </motion.div>

//         {/* Right side – message */}
//         <motion.div
//           className="glass split-box"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           style={{ justifyContent: 'flex-start', textAlign: 'left', alignItems: 'flex-start' }}
//         >
//           <motion.h4
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             style={{ textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', color: 'var(--accent)' }}
//           >
//             Happy Birthday!
//           </motion.h4>

//           <motion.h1
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="gradient-text"
//             style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem', lineHeight: 1.1 }}
//           >
//             {data.name}
//           </motion.h1>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             style={{
//               fontSize: '1.25rem',
//               lineHeight: '1.8',
//               color: '#cbd5e1',
//               width: '100%',
//               maxHeight: '400px',
//               overflowY: 'auto',
//               paddingRight: '1rem',
//               scrollbarWidth: 'thin',
//               scrollbarColor: 'var(--accent) transparent',
//             }}
//           >
//             {data.message?.split('\n').map((para, i) => (
//               <p key={i} style={{ marginBottom: '1.5rem' }}>
//                 {para}
//               </p>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }