const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/eventController');

// POST /events → Submit a new event
router.post('/', createEvent);

module.exports = router;