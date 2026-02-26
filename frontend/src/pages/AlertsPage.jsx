import { useState, useEffect } from 'react';
import { getAlerts, clearAlerts } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle, Calendar, Filter, Trash2 } from 'lucide-react';

function AlertsPage() {
  const { darkMode } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch alerts when page loads
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Apply date filter whenever alerts or dates change
  useEffect(() => {
    filterAlertsByDate();
  }, [alerts, startDate, endDate]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await getAlerts();
      setAlerts(response.data.alerts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch alerts');
      setLoading(false);
    }
  };

  const filterAlertsByDate = () => {
    if (!startDate && !endDate) {
      setFilteredAlerts(alerts);
      return;
    }

    const filtered = alerts.filter((alert) => {
      const alertDate = new Date(alert.triggered_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      if (start && end) {
        return alertDate >= start && alertDate <= end;
      } else if (start) {
        return alertDate >= start;
      } else if (end) {
        return alertDate <= end;
      }
      return true;
    });

    setFilteredAlerts(filtered);
  };

  const handleClearAlerts = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all alerts?\n\nThis action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      await clearAlerts();
      setMessage('All alerts cleared successfully!');
      setAlerts([]);
      setFilteredAlerts([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to clear alerts');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // Format date nicely
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-sm p-6 mb-6 transition-colors`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Alerts Dashboard
            </h2>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {filteredAlerts.length} of {alerts.length} alert(s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* Clear All Button */}
            {alerts.length > 0 && (
              <button
                onClick={handleClearAlerts}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Date Filter Section */}
        {showFilters && (
          <div className={`mt-4 p-4 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <label className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  From:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  To:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {(startDate || endDate) && (
                <button
                  onClick={resetFilters}
                  className={`text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mt-4 text-sm font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mt-4 text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-sm p-12 text-center transition-colors`}>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Loading alerts...
          </p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-sm p-12 text-center transition-colors`}>
          <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${
            darkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {alerts.length === 0 
              ? 'No alerts yet. Submit an event that violates a rule to see alerts here!'
              : 'No alerts found for the selected date range.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.alert_id}
              className={`rounded-xl shadow-sm border-l-4 border-red-500 p-6 hover:shadow-md transition-all ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {alert.rule_name}
                  </h3>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Alert ID: #{alert.alert_id}
                  </p>
                </div>
                <span className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {formatDate(alert.triggered_at)}
                </span>
              </div>

              {/* Alert Message */}
              <p className={`text-sm mb-4 p-3 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {alert.message}
              </p>

              {/* Alert Details Grid */}
              <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                {/* Rule Condition */}
                <div>
                  <p className={`text-xs font-semibold mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Rule Condition
                  </p>
                  <code className={`text-xs px-2 py-1 rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {alert.rule_condition.field}{' '}
                    {alert.rule_condition.operator}{' '}
                    {alert.rule_condition.value}
                  </code>
                </div>

                {/* Event Type */}
                <div>
                  <p className={`text-xs font-semibold mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Event Type
                  </p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-medium">
                    {alert.event_type}
                  </span>
                </div>

                {/* Event Payload */}
                <div className="col-span-2">
                  <p className={`text-xs font-semibold mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Event Payload
                  </p>
                  <pre className={`text-xs p-2 rounded overflow-x-auto ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {JSON.stringify(alert.event_payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPage;