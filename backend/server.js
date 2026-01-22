import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';

const app = express();
const PORT = 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// MongoDB Connection
// Connects to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Schema & Model
const wishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  photo: {
    data: Buffer,
    contentType: String
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

// Auto-delete document 0 seconds after endTime
wishSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 });

const Wish = mongoose.model('Wish', wishSchema);

// Routes

// Get currently active wish (Public)
app.get('/api/wish', async (req, res) => {
  try {
    const now = new Date();
    // Find a wish where now is between startTime and endTime
    const wish = await Wish.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    if (!wish) {
       return res.json({ name: '', message: '', photo: null });
    }
    
    // Convert buffer to base64 for frontend
    const wishData = wish.toObject();
    if (wishData.photo && wishData.photo.data) {
        wishData.photo = `data:${wish.photo.contentType};base64,${wish.photo.data.toString('base64')}`;
        // Remove raw buffer
        delete wishData.photo.data;
    } else {
        wishData.photo = null;
    }

    res.json(wishData);
  } catch (error) {
    console.error('Error fetching wish:', error);
    res.status(500).json({ error: 'Error fetching wish' });
  }
});

// Add new wish (Admin) - creates new, verifies overlap, auto calculates end time (1 hr)
app.post('/api/wish', upload.single('photo'), async (req, res) => {
  try {
    const { name, message, startTime } = req.body;
    
    if (!name || !message || !startTime) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse dates
    const start = new Date(startTime);
    
    if (isNaN(start.getTime())) {
         return res.status(400).json({ error: 'Invalid start time format' });
    }

    // Calculate End Time (Start + 1 Hour)
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // Validation 2: Overlap
    // Check if any wish overlaps with [start, end]
    const overlap = await Wish.findOne({
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } } 
        ]
    });

    if (overlap) {
        return res.status(400).json({ 
            error: 'Time slot overlaps with an existing wish.',
            conflictingWish: {
                startTime: overlap.startTime,
                endTime: overlap.endTime,
                name: overlap.name
            }
        });
    }

    const newWish = new Wish({
        name,
        message,
        startTime: start,
        endTime: end
    });

    if (req.file) {
        newWish.photo = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    await newWish.save();
    res.status(201).json({ success: true, wish: { name: newWish.name, startTime: newWish.startTime, endTime: newWish.endTime } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving wish' });
  }
});
app.get('/', (req, res) => {
  res.json({ message: 'BD Wisher API is running!', status: 'ready' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
