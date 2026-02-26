const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database connection
const pool = require('./models/db');

// Import all routes
const rulesRouter = require('./routes/rules');
const eventsRouter = require('./routes/events');
const alertsRouter = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────
// Middleware
// ─────────────────────────────────
app.use(cors());
app.use(express.json());

// ─────────────────────────────────
// Routes
// ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: ' Rule-Based Monitoring System API is running!' });
});

app.use('/rules', rulesRouter);
app.use('/events', eventsRouter);
app.use('/alerts', alertsRouter);

// ─────────────────────────────────
// Start Server
// ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});