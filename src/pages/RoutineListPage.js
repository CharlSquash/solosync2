// src/pages/RoutineListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DrillCard from '../components/DrillCard';

const RoutineListPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRoutineId, setExpandedRoutineId] = useState(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/solosync2/routines/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const sortedRoutines = response.data.map(routine => ({
                    ...routine,
                    drills: routine.drills.sort((a, b) => a.order - b.order)
                }));
                setRoutines(sortedRoutines);
            } catch (err) {
                setError('Failed to fetch routines.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    const toggleRoutine = (id) => {
        setExpandedRoutineId(expandedRoutineId === id ? null : id);
    };

    if (loading) return <div className="text-center text-white">Loading routines...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white mb-6">Your Routines</h1>
            <div className="space-y-4">
                {routines.map(routine => (
                    <div key={routine.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleRoutine(routine.id)}
                        >
                            <div>
                                <h2 className="text-2xl font-semibold text-white">{routine.name}</h2>
                                <p className="text-gray-400">{routine.description}</p>
                            </div>
                            <Link to={`/session/${routine.id}`}>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Start
                                </button>
                            </Link>
                        </div>
                        {expandedRoutineId === routine.id && (
                            <div className="p-4 border-t border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4">Drills</h3>
                                <div className="space-y-3">
                                    {/* --- FIX IS HERE: Added the key prop --- */}
                                    {routine.drills.map(drillInRoutine => (
                                        <DrillCard key={drillInRoutine.drill.id} drill={drillInRoutine} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoutineListPage;