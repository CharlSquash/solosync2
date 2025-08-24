// src/pages/SessionPlayerPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Timer from '../components/Timer';

const SessionPlayerPage = () => {
    const { routineId } = useParams();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Player State
    const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [isSessionRunning, setIsSessionRunning] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        soundEnabled: true,
        speechEnabled: true,
    });

    useEffect(() => {
        const fetchRoutineDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/solosync2/routines/${routineId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                response.data.drills.sort((a, b) => a.order - b.order);
                setRoutine(response.data);
            } catch (err) {
                setError('Failed to fetch routine details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutineDetails();
    }, [routineId]);

    const handleTimerComplete = () => {
        if (isResting) {
            // Rest is over, move to the next drill
            setIsResting(false);
            setCurrentDrillIndex(prev => prev + 1);
        } else {
            // Drill is over, check if there's a next drill
            if (currentDrillIndex < routine.drills.length - 1) {
                // Start resting
                setIsResting(true);
            } else {
                // This was the last drill
                setIsSessionRunning(false);
            }
        }
    };

    const toggleSetting = (setting) => {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };

    if (loading) return <div className="text-center text-white">Loading routine...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!routine) return <div className="text-center text-white">Routine not found.</div>;

    const currentDrill = routine.drills[currentDrillIndex];
    const isLastDrill = currentDrillIndex >= routine.drills.length - 1;

    let timerSeconds = 0;
    let mainText = "Ready?";
    let subText = "Press Start to begin the session";
    let textToSpeak = `First drill: ${currentDrill.drill.name}`;

    if (isSessionRunning) {
        if (isResting) {
            timerSeconds = currentDrill.rest_duration_seconds;
            mainText = "Rest";
            subText = `Next up: ${routine.drills[currentDrillIndex + 1].drill.name}`;
            textToSpeak = `Rest. Next up: ${routine.drills[currentDrillIndex + 1].drill.name}`;
        } else {
            timerSeconds = currentDrill.duration_minutes * 60;
            mainText = currentDrill.drill.name;
            subText = currentDrill.drill.description;
            textToSpeak = mainText;
        }
    }

    const bgColor = isSessionRunning && !isResting ? 'bg-green-800' : 'bg-blue-800';

    return (
        <div className={`transition-colors duration-500 ${isSessionRunning ? bgColor : 'bg-primary'} min-h-screen text-white text-center p-4 flex flex-col justify-between`}>

            {/* Header Info */}
            <div>
                <h1 className="text-3xl font-bold">{routine.name}</h1>
                <p className="text-lg text-gray-300">
                    {isSessionRunning ? `Drill ${currentDrillIndex + 1} of ${routine.drills.length}` : 'Session Paused'}
                </p>
            </div>

            {/* Main Content: Timer and Drill Info */}
            <div className="flex-grow flex flex-col items-center justify-center">
                {isSessionRunning ? (
                    <>
                        <p className="text-4xl font-bold mb-4">{mainText}</p>
                        <Timer
                            initialSeconds={timerSeconds}
                            onComplete={handleTimerComplete}
                            isRunning={isSessionRunning}
                            isResting={isResting}
                            textToSpeak={textToSpeak}
                            settings={settings}
                        />
                        <p className="text-xl text-gray-300 mt-4">{subText}</p>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-4xl font-bold mb-4">Ready to start?</p>
                        <p className="text-xl mb-8">First drill: {currentDrill.drill.name}</p>
                        <button onClick={() => setIsSessionRunning(true)} className="px-8 py-4 text-2xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                            START SESSION
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="flex justify-between items-center">
                {/* Settings Toggles */}
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={settings.soundEnabled} onChange={() => toggleSetting('soundEnabled')} className="form-checkbox h-5 w-5"/>
                        <span>Sounds</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={settings.speechEnabled} onChange={() => toggleSetting('speechEnabled')} className="form-checkbox h-5 w-5"/>
                        <span>Speech</span>
                    </label>
                </div>

                {/* Main Action Buttons */}
                <div>
                    {isSessionRunning && (
                         <button onClick={() => setIsSessionRunning(false)} className="px-6 py-2 font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700">
                            Pause
                        </button>
                    )}
                    {!isLastDrill || isResting ? null : (
                        <Link to={`/summary/${routine.id}`}>
                            <button disabled={isSessionRunning} className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500">
                                Finish & Log
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPlayerPage;