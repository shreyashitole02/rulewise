import { useState, useEffect } from 'react';
import { getRules, createRule, toggleRule, deleteRule } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Search, Plus, Trash2, FileText, Zap } from 'lucide-react';

function RulesPage() {
  const { darkMode } = useTheme();
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('>');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  // Rule Templates
  const templates = [
    {
      name: 'High Transaction Alert',
      description: 'Alert when transaction amount exceeds 10000',
      field: 'amount',
      operator: '>',
      value: '10000'
    },
    {
      name: 'Failed Login Detection',
      description: 'Alert when login attempts exceed 3',
      field: 'attempts',
      operator: '>',
      value: '3'
    },
    {
      name: 'Low Balance Warning',
      description: 'Alert when account balance falls below 1000',
      field: 'balance',
      operator: '<',
      value: '1000'
    },
    {
      name: 'Suspicious Activity',
      description: 'Alert when risk score equals 100',
      field: 'risk_score',
      operator: '==',
      value: '100'
    }
  ];

  useEffect(() => { 
    fetchRules(); 
  }, []);

  useEffect(() => {
    filterRules();
  }, [rules, searchQuery]);

  const fetchRules = async () => {
    try {
      const response = await getRules();
      setRules(response.data.rules);
    } catch (err) {
      setError('Failed to fetch rules');
    }
  };

  const filterRules = () => {
    if (!searchQuery.trim()) {
      setFilteredRules(rules);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = rules.filter(rule => 
      rule.name.toLowerCase().includes(query) ||
      rule.description?.toLowerCase().includes(query) ||
      rule.condition.field.toLowerCase().includes(query)
    );
    setFilteredRules(filtered);
  };

  const applyTemplate = (template) => {
    setName(template.name);
    setDescription(template.description);
    setField(template.field);
    setOperator(template.operator);
    setValue(template.value);
    setShowTemplates(false);
    setMessage('Template applied! Modify as needed and click Create Rule.');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCreateRule = async () => {
    if (!name || !field || !value) {
      setError('Please fill in all required fields (Name, Field, Value)');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      const condition = { field, operator, value: Number(value) };
      await createRule({ name, description, condition });
      setMessage('Rule created successfully!');
      setError('');
      setName(''); 
      setDescription(''); 
      setField('');
      setOperator('>'); 
      setValue('');
      fetchRules();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to create rule');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleRule(id);
      fetchRules();
    } catch (err) {
      setError('Failed to toggle rule');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id, ruleName) => {
    const confirmed = window.confirm(
      `⚠️ Delete Rule: "${ruleName}"?\n\nThis action cannot be undone. Any alerts linked to this rule will remain in the system.`
    );
    
    if (!confirmed) return;

    try {
      await deleteRule(id);
      setMessage('Rule deleted successfully!');
      fetchRules();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete rule. It may have alerts linked to it.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div>
      {/* ── Create Rule Form ── */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-sm p-6 mb-6 transition-colors`}>
        
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Create New Rule
          </h2>
          
          {/* Templates Button */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            {showTemplates ? 'Hide Templates' : 'Use Template'}
          </button>
        </div>

        {/* Templates Section */}
        {showTemplates && (
          <div className={`mb-5 p-4 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Quick Start Templates
            </p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => applyTemplate(template)}
                  className={`text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 hover:border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <p className={`font-semibold text-sm mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {template.name}
                  </p>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {template.description}
                  </p>
                  <code className={`text-xs mt-2 inline-block px-2 py-1 rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.field} {template.operator} {template.value}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Rule Name */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Rule Name *
          </label>
          <input
            type="text"
            placeholder="e.g. High Transaction Alert"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Description
          </label>
          <input
            type="text"
            placeholder="e.g. Alert when amount exceeds 10000"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Field + Operator + Value */}
        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className={`block text-sm font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Field *
            </label>
            <input
              type="text"
              placeholder="e.g. amount"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <div className="flex-1">
            <label className={`block text-sm font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Operator *
            </label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value=">"> &gt; Greater than</option>
              <option value="<"> &lt; Less than</option>
              <option value="==">== Equal to</option>
              <option value="!=">!= Not equal to</option>
            </select>
          </div>

          <div className="flex-1">
            <label className={`block text-sm font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Value *
            </label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <button
          onClick={handleCreateRule}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      {/* ── Rules List ── */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-sm p-6 transition-colors`}>
        
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            All Rules ({filteredRules.length})
          </h2>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {filteredRules.length === 0 ? (
          <div className="text-center py-12">
            <FileText className={`w-12 h-12 mx-auto mb-3 ${
              darkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {rules.length === 0 
                ? 'No rules yet. Create your first rule above!'
                : 'No rules found matching your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className={`text-left px-4 py-3 font-semibold border-b ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    Name
                  </th>
                  <th className={`text-left px-4 py-3 font-semibold border-b ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    Condition
                  </th>
                  <th className={`text-left px-4 py-3 font-semibold border-b ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    Status
                  </th>
                  <th className={`text-left px-4 py-3 font-semibold border-b ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    Toggle
                  </th>
                  <th className={`text-left px-4 py-3 font-semibold border-b ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600' 
                      : 'text-gray-500 border-gray-100'
                  }`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr 
                    key={rule.rule_id} 
                    className={`transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className={`px-4 py-3 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    }`}>
                      <p className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {rule.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {rule.description}
                      </p>
                    </td>
                    <td className={`px-4 py-3 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    }`}>
                      <code className={`px-2 py-1 rounded text-xs ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {rule.condition.field} {rule.condition.operator} {rule.condition.value}
                      </code>
                    </td>
                    <td className={`px-4 py-3 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    }`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        rule.is_active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    }`}>
                      <button
                        onClick={() => handleToggle(rule.rule_id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          rule.is_active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label={`Toggle ${rule.name}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          rule.is_active ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </td>
                    <td className={`px-4 py-3 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    }`}>
                      <button
                        onClick={() => handleDelete(rule.rule_id, rule.name)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RulesPage;