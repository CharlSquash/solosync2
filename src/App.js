import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SessionHistoryPage from './pages/SessionHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoutineListPage from './pages/RoutineListPage';
import SessionPlayerPage from './pages/SessionPlayerPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import { Link, useNavigate } from 'react-router-dom';

const AppHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (location.pathname === '/login') {
        return null;
    }

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">SoloSync</h1>
            <nav>
                <Link to="/" className="text-gray-300 hover:text-white mr-4">Routines</Link>
                <Link to="/history" className="text-gray-300 hover:text-white mr-4">History</Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">
                    Logout
                </button>
            </nav>
        </header>
    );
};

function App() {
  return (
    <Router>
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <AppHeader />
            <main className="p-4 md:p-8">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<ProtectedRoute><RoutineListPage /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><SessionHistoryPage /></ProtectedRoute>} />
                    <Route path="/session/:routineId" element={<ProtectedRoute><SessionPlayerPage /></ProtectedRoute>} />
                    <Route path="/summary/:routineId" element={<ProtectedRoute><SessionSummaryPage /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    </Router>
  );
}

export default App;