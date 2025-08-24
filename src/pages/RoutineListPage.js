// src/pages/RoutineListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// A new, separate component for a single routine item to keep the code clean
const RoutineItem = ({ routine, index, activeIndex, setActiveIndex }) => {
    const isActive = index === activeIndex;

    const toggleAccordion = () => {
        setActiveIndex(isActive ? null : index);
    };

    // Find the YouTube link from the drills, if one exists
    const youtubeLink = routine.drills.find(d => d.drill.youtube_link)?.drill.youtube_link;

    return (
        <div className="border border-accent rounded-lg overflow-hidden">
            <button
                onClick={toggleAccordion}
                className="w-full text-left p-4 bg-primary hover:bg-accent text-white flex justify-between items-center transition-colors duration-300"
            >
                <span className="font-semibold text-lg">{routine.name}</span>
                <span className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                    &#9660;
                </span>
            </button>
            {isActive && (
                <div className="p-4 bg-secondary text-gray-300">
                    <p className="mb-4">{routine.description}</p>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Drills:</h3>
                        <ul className="list-disc list-inside">
                            {routine.drills.map(drillItem => (
                                <li key={drillItem.order}>
                                    {drillItem.drill.name} ({drillItem.duration_minutes} min)
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex space-x-4">
                        <Link to={`/session/${routine.id}`}>
                            <button className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Start Practice
                            </button>
                        </Link>
                        {youtubeLink && (
                            <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                                <button className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                                    Watch Video
                                </button>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


const RoutineListPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null); // State for the accordion

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/solosync2/routines/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRoutines(response.data);
            } catch (err) {
                setError('Failed to fetch routines.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    if (loading) return <div className="text-center text-white">Loading routines...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
                {routines.map((routine, index) => (
                    <RoutineItem
                        key={routine.id}
                        routine={routine}
                        index={index}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoutineListPage;