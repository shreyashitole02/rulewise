import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import RulesPage from './pages/RulesPage';
import EventsPage from './pages/EventsPage';
import AlertsPage from './pages/AlertsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <Navbar />
          <div className="max-w-5xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<RulesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;