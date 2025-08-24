// src/pages/RoutineListPage.js (Simplified for Debugging)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // Use the new api instance

const RoutineListPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                // This is the key change we are testing
                const response = await api.get('/api/solosync2/routines/');
                setRoutines(response.data);
            } catch (err) {
                setError('Failed to fetch routines.');
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    if (loading) {
        return <div className="text-center mt-8">Loading routines...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-400">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-teal-400 mb-6">Routines</h1>
            {routines.length === 0 ? (
                <p className="text-center text-gray-400">No routines available.</p>
            ) : (
                <div className="space-y-4">
                    {routines.map((routine) => (
                        <div key={routine.id} className="bg-gray-800 rounded-lg shadow-lg p-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-yellow-400">{routine.name}</h2>
                                <p className="text-sm text-gray-400">{routine.description}</p>
                            </div>
                            <Link 
                                to={`/session/${routine.id}`} 
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Start
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoutineListPage;