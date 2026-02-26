const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const rulesRouter = require('./routes/rules');
const eventsRouter = require('./routes/events');
const alertsRouter = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'RuleWise API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/rules', rulesRouter);
app.use('/events', eventsRouter);
app.use('/alerts', alertsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});