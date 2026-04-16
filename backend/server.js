import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Waitlist Schema
const waitlistSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  phone:   { type: String, trim: true },
  country: { type: String, trim: true },
  company: { type: String, trim: true },
  message: { type: String, trim: true },
  type:    { type: String, enum: ['saver', 'operator'], default: 'saver' },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate emails per type
waitlistSchema.index({ email: 1, type: 1 }, { unique: true });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/waitlist', async (req, res) => {
  const { name, email, phone, country, company, message, type } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    const entry = await Waitlist.create({
      name, email, phone, country, company, message,
      type: type || 'saver',
    });

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      id: entry._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This email is already on the waitlist.' });
    }
    console.error('Waitlist error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

app.get('/api/waitlist/count', async (req, res) => {
  try {
    const savers = await Waitlist.countDocuments({ type: 'saver' });
    const operators = await Waitlist.countDocuments({ type: 'operator' });
    res.json({ savers, operators, total: savers + operators });
  } catch (err) {
    console.error('Count error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SoSave API running on port ${PORT}`);
});
