import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`${
      darkMode ? 'bg-gray-800' : 'bg-blue-450'
    } px-8 py-4 flex items-center justify-between shadow-lg transition-colors`}>
      
      {/* Brand with Logo */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${
          darkMode ? 'bg-blue-600' : 'bg-blue-700'
        } flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-lg">RW</span>
        </div>
        <span className="text-white text-xl font-bold tracking-wide">
          RuleWise
        </span>
      </div>

      {/* Links & Dark Mode Toggle */}
      <div className="flex items-center gap-8">
        <ul className="flex gap-8 list-none m-0 p-0">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-bold text-sm border-b-2 border-white pb-1'
                  : 'text-gray-200 hover:text-white text-sm transition-colors'
              }
            >
              Rules
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-bold text-sm border-b-2 border-white pb-1'
                  : 'text-gray-200 hover:text-white text-sm transition-colors'
              }
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-bold text-sm border-b-2 border-white pb-1'
                  : 'text-gray-200 hover:text-white text-sm transition-colors'
              }
            >
              Alerts
            </NavLink>
          </li>
        </ul>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-all hover:scale-110 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-blue-700 hover:bg-blue-800'
          }`}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;