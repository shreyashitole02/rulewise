import { useState } from 'react';
import { createEvent } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Send, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

function EventsPage() {
  const { darkMode } = useTheme();
  const [eventType, setEventType] = useState('');
  const [fields, setFields] = useState([{ key: '', value: '' }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);

  // Add a new field row
  const addField = () => {
    setFields([...fields, { key: '', value: '' }]);
  };

  // Remove a field row
  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Update field key or value
  const updateField = (index, type, value) => {
    const newFields = [...fields];
    newFields[index][type] = value;
    setFields(newFields);
  };

  // Submit event
  const handleSubmit = async () => {
    // Validation
    if (!eventType.trim()) {
      setError('Please enter an event type');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if at least one field has both key and value
    const validFields = fields.filter(f => f.key.trim() && f.value.trim());
    if (validFields.length === 0) {
      setError('Please add at least one field with both key and value');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Build payload object from fields
    const payload = {};
    validFields.forEach(field => {
      // Try to convert to number if possible
      const numValue = Number(field.value);
      payload[field.key] = isNaN(numValue) ? field.value : numValue;
    });

    try {
      const response = await createEvent({
        type: eventType,
        payload: payload
      });

      setMessage(`Event submitted successfully! ${response.data.alertsTriggered} alert(s) triggered`);
      setError('');
      setAlerts(response.data.alerts || []);

      // Clear form
      setEventType('');
      setFields([{ key: '', value: '' }]);

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setAlerts([]);
      }, 5000);

    } catch (err) {
      setError('Failed to submit event. Please try again.');
      setMessage('');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      {/* Submit Event Form */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-sm p-6 mb-6 transition-colors`}>
        
        <h2 className={`text-xl font-bold mb-5 pb-3 border-b ${
          darkMode 
            ? 'text-white border-gray-700' 
            : 'text-gray-800 border-gray-100'
        }`}>
          Submit New Event
        </h2>

        {/* Success/Error Messages */}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Event Type */}
        <div className="mb-5">
          <label className={`block text-sm font-semibold mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Event Type *
          </label>
          <input
            type="text"
            placeholder="e.g. TRANSACTION, LOGIN, PURCHASE"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Dynamic Fields */}
        <div className="mb-5">
          <label className={`block text-sm font-semibold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Event Payload (Fields) *
          </label>

          {fields.map((field, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Field name (e.g. amount)"
                value={field.key}
                onChange={(e) => updateField(index, 'key', e.target.value)}
                className={`flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
              <input
                type="text"
                placeholder="Value (e.g. 15000)"
                value={field.value}
                onChange={(e) => updateField(index, 'value', e.target.value)}
                className={`flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
              {fields.length > 1 && (
                <button
                  onClick={() => removeField(index)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    darkMode
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  aria-label="Remove field"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addField}
            className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
              darkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Event
        </button>
      </div>

      {/* Triggered Alerts */}
      {alerts.length > 0 && (
        <div className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-sm p-6 transition-colors`}>
          
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alerts Triggered ({alerts.length})
          </h3>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.alert_id}
                className={`border-l-4 border-red-500 p-4 rounded-lg ${
                  darkMode 
                    ? 'bg-red-900/20' 
                    : 'bg-red-50'
                }`}
              >
                <p className={`font-semibold text-sm mb-1 ${
                  darkMode ? 'text-red-400' : 'text-red-800'
                }`}>
                  Alert #{alert.alert_id}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;