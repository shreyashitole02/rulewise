const pool = require('../models/db');
const { runRuleEngine } = require('../services/ruleEngine');

// ─────────────────────────────────────────
// SUBMIT AN EVENT
// Called when: POST /events
// ─────────────────────────────────────────

const createEvent = async (req, res) => {
  try {
    // Step 1: Extract data from request
    const { type, payload } = req.body;

    // Step 2: Validate required fields
    if (!type || !payload) {
      return res.status(400).json({
        error: 'Event type and payload are required'
      });
    }

    // Step 3: Save event to database
    const query = `
      INSERT INTO events (type, payload)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [type, payload]);
    const savedEvent = result.rows[0];

    console.log('\n New event saved:', savedEvent);

    // Step 4: Run the rule engine on this event
    // This checks all active rules and creates alerts
    const alertsCreated = await runRuleEngine(savedEvent);

    // Step 5: Send response back
    res.status(201).json({
      message: 'Event processed successfully',
      event: savedEvent,
      alertsTriggered: alertsCreated.length,
      alerts: alertsCreated
    });

  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createEvent };