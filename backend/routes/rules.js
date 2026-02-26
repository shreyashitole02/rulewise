const express = require('express');
const router = express.Router();

// Import controller functions
const { createRule, getAllRules, toggleRule, deleteRule } = require('../controllers/ruleController');

// ─────────────────────────────────
// Define Routes
// ─────────────────────────────────

// POST /rules → Create a new rule
router.post('/', createRule);

// GET /rules → Get all rules
router.get('/', getAllRules);

// PATCH /rules/:id/toggle → Toggle rule on/off
router.patch('/:id/toggle', toggleRule);

//Temporary delete route
router.delete('/:id', deleteRule);

module.exports = router;