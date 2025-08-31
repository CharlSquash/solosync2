// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoutineListPage from './pages/RoutineListPage';
import SessionPlayerPage from './pages/SessionPlayerPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import SessionHistoryPage from './pages/SessionHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <Link to="/" className="text-xl">SoloSync</Link>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link to="/history" className="text-white hover:text-gray-300">History</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><RoutineListPage /></ProtectedRoute>} />
            <Route path="/session/:id" element={<ProtectedRoute><SessionPlayerPage /></ProtectedRoute>} />
            <Route path="/summary" element={<ProtectedRoute><SessionSummaryPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><SessionHistoryPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Only show the logout button if the user is logged in
  if (!localStorage.getItem('access_token')) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default App;