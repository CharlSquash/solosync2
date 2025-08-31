import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import DrillCard from '../components/DrillCard';

const RoutineListPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRoutineId, setExpandedRoutineId] = useState(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await api.get('/api/solosync2/routines/');
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

    const toggleRoutineDetails = (routineId) => {
        setExpandedRoutineId(expandedRoutineId === routineId ? null : routineId);
    };

    if (loading) {
        return <div className="text-center mt-8">Loading routines...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-400">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-400">Routines</h1>
            </div>

            {routines.length === 0 ? (
                <p className="text-center text-gray-400">No routines available. Please add some in the admin dashboard.</p>
            ) : (
                <div className="space-y-4">
                    {routines.map((routine) => (
                        <div key={routine.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleRoutineDetails(routine.id)}>
                                <div>
                                    <h2 className="text-xl font-bold text-yellow-400">{routine.name}</h2>
                                    <p className="text-sm text-gray-400">{routine.drills.length} drills</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to={`/session/${routine.id}`}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                        onClick={(e) => e.stopPropagation()} // Prevents the accordion from toggling
                                    >
                                        Start
                                    </Link>
                                    <span className={`transform transition-transform duration-200 ${expandedRoutineId === routine.id ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                            {expandedRoutineId === routine.id && (
                                <div className="p-4 border-t border-gray-700">
                                    <p className="text-gray-300 mb-4">{routine.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {routine.drills.map(drill => (
                                            <DrillCard key={drill.id} drill={drill} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoutineListPage;