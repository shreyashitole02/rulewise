const pool = require('../models/db');

// GET ALL ALERTS
const getAllAlerts = async (req, res) => {
  try {
    const query = `
      SELECT 
        alerts.alert_id,
        alerts.message,
        alerts.triggered_at,
        rules.name AS rule_name,
        rules.condition AS rule_condition,
        events.type AS event_type,
        events.payload AS event_payload
      FROM alerts
      JOIN rules ON alerts.rule_id = rules.rule_id
      JOIN events ON alerts.event_id = events.event_id
      ORDER BY alerts.triggered_at DESC
    `;
    const result = await pool.query(query);

    res.status(200).json({
      message: 'Alerts fetched successfully',
      count: result.rows.length,
      alerts: result.rows
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CLEAR ALL ALERTS
const deleteAllAlerts = async (req, res) => {
  try {
    await pool.query('DELETE FROM alerts');
    res.status(200).json({ message: 'All alerts cleared' });
  } catch (error) {
    console.error('Error clearing alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllAlerts, deleteAllAlerts };