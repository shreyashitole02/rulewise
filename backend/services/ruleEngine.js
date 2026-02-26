const pool = require('../models/db');

// ─────────────────────────────────────────────────────
// THE CORE FUNCTION: Evaluate one rule against one event
// ─────────────────────────────────────────────────────

const evaluateCondition = (eventPayload, condition) => {
  // Step 1: Extract the 3 parts of the rule condition
  const { field, operator, value } = condition;

  // Step 2: Get the actual value from the event payload
  // Example: if field = "amount", get eventPayload["amount"]
  const eventValue = eventPayload[field];

  // Step 3: If the field doesn't exist in the event, skip
  if (eventValue === undefined) {
    console.log(`Field "${field}" not found in event payload`);
    return false;
  }

  // Step 4: Compare using the operator
  console.log(`Checking: ${eventValue} ${operator} ${value}`);

  switch (operator) {
    case '>':
      return eventValue > value;

    case '<':
      return eventValue < value;

    case '==':
      return eventValue == value;

    case '!=':
      return eventValue != value;

    default:
      console.log(`Unknown operator: ${operator}`);
      return false;
  }
};

// ─────────────────────────────────────────────────────
// MAIN ENGINE: Run ALL active rules against ONE event
// ─────────────────────────────────────────────────────

const runRuleEngine = async (event) => {
  try {
    console.log('\n Rule Engine Started...');
    console.log('Event received:', event);

    // Step 1: Fetch ALL active rules from database
    const rulesResult = await pool.query(
      'SELECT * FROM rules WHERE is_active = true'
    );
    const activeRules = rulesResult.rows;

    console.log(` Found ${activeRules.length} active rule(s)`);

    // Step 2: Track how many alerts were created
    const alertsCreated = [];

    // Step 3: Loop through every rule
    for (const rule of activeRules) {
      console.log(`\n Evaluating rule: "${rule.name}"`);

      // Step 4: Check if this rule is violated by the event
      const isViolated = evaluateCondition(
        event.payload,
        rule.condition
      );

      // Step 5: If violated → create an alert
      if (isViolated) {
        console.log(` Rule VIOLATED: "${rule.name}"`);

        // Create alert message
        const alertMessage = `Rule "${rule.name}" triggered: 
          Field "${rule.condition.field}" 
          with value ${event.payload[rule.condition.field]} 
          ${rule.condition.operator} ${rule.condition.value}`;

        // Save alert to database
        const alertQuery = `
          INSERT INTO alerts (rule_id, event_id, message)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const alertResult = await pool.query(alertQuery, [
          rule.rule_id,
          event.event_id,
          alertMessage
        ]);

        alertsCreated.push(alertResult.rows[0]);
        console.log(` Alert created for rule: "${rule.name}"`);

      } else {
        console.log(` Rule OK: "${rule.name}" - No violation`);
      }
    }

    console.log(`\n Rule Engine Done. ${alertsCreated.length} alert(s) created`);
    return alertsCreated;

  } catch (error) {
    console.error(' Rule Engine Error:', error);
    throw error;
  }
};

module.exports = { runRuleEngine };