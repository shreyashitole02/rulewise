const pool = require('../models/db');

// ─────────────────────────────────────────
// CREATE A NEW RULE
// Called when: POST /rules
// ─────────────────────────────────────────
const createRule = async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    const { name, description, condition } = req.body;

    // Step 2: Validate - make sure required fields exist
    if (!name || !condition) {
      return res.status(400).json({
        error: 'Name and condition are required'
      });
    }

    // Step 3: Insert into database
    const query = `
      INSERT INTO rules (name, description, condition)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, description, condition];
    const result = await pool.query(query, values);

    // Step 4: Send back the created rule
    res.status(201).json({
      message: 'Rule created successfully',
      rule: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─────────────────────────────────────────
// GET ALL RULES
// Called when: GET /rules
// ─────────────────────────────────────────
const getAllRules = async (req, res) => {
  try {
    // Fetch all rules, newest first
    const query = `
      SELECT * FROM rules
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);

    res.status(200).json({
      message: 'Rules fetched successfully',
      count: result.rows.length,
      rules: result.rows
    });

  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─────────────────────────────────────────
// TOGGLE RULE (Enable / Disable)
// Called when: PATCH /rules/:id/toggle
// ─────────────────────────────────────────
const toggleRule = async (req, res) => {
  try {
    // Step 1: Get rule ID from URL
    const { id } = req.params;

    // Step 2: Check if rule exists
    const findQuery = `SELECT * FROM rules WHERE rule_id = $1`;
    const findResult = await pool.query(findQuery, [id]);

    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Step 3: Flip the is_active value (true → false, false → true)
    const currentStatus = findResult.rows[0].is_active;
    const newStatus = !currentStatus;

    // Step 4: Update the database
    const updateQuery = `
      UPDATE rules
      SET is_active = $1
      WHERE rule_id = $2
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [newStatus, id]);

    res.status(200).json({
      message: `Rule ${newStatus ? 'enabled' : 'disabled'} successfully`,
      rule: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error toggling rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE A RULE
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM rules WHERE rule_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.status(200).json({
      message: 'Rule deleted successfully',
      rule: result.rows[0]
    });

  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export all functions so routes can use them
module.exports = { createRule, getAllRules, toggleRule, deleteRule };