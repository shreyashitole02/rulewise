const express = require('express');
const router = express.Router();
const { getAllAlerts, deleteAllAlerts } = require('../controllers/alertController');

// GET /alerts
router.get('/', getAllAlerts);

// DELETE /alerts/clear
router.delete('/clear', deleteAllAlerts);

module.exports = router;
