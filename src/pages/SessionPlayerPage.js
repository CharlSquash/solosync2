// src/pages/SessionPlayerPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; 
import Timer from '../components/Timer';

const SessionPlayerPage = () => {
    const { id } = useParams(); // CORRECTED: Was routineId, now it's id to match the route
    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Player State
    const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [isSessionRunning, setIsSessionRunning] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [textToSpeak, setTextToSpeak] = useState('');
    
    // Lifted State
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [speechSpoken, setSpeechSpoken] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        soundEnabled: true,
        speechEnabled: true,
    });

    // Screen Wake Lock
    const wakeLock = useRef(null);

    const acquireWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try {
                wakeLock.current = await navigator.wakeLock.request('screen');
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    };

    const releaseWakeLock = () => {
        if (wakeLock.current) {
            wakeLock.current.release();
            wakeLock.current = null;
        }
    };

    useEffect(() => {
        const fetchRoutineDetails = async () => {
            try {
                // CORRECTED: Use 'id' in the API call URL
                const response = await api.get(`/api/solosync2/routines/${id}/`);
                
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
        return () => releaseWakeLock();
    }, [id]);
    
    useEffect(() => {
        if (!routine) return;
        const drill = routine.drills[currentDrillIndex];
        if (!drill) return;
        const duration = isResting ? drill.rest_duration_seconds : drill.duration_minutes * 60;
        setTotalDuration(duration);
        setCurrentTime(duration);
        setSpeechSpoken(false); 
    }, [routine, currentDrillIndex, isResting]);


    useEffect(() => {
        if (isSessionRunning) {
            acquireWakeLock();
            if (isResting) {
                setTextToSpeak("Rest");
            } else {
                const currentDrill = routine?.drills[currentDrillIndex];
                if (currentDrill) {
                    setTextToSpeak(currentDrill.drill.name);
                }
            }
        } else {
            releaseWakeLock();
        }
    }, [isSessionRunning, currentDrillIndex, isResting, routine]);


    const handleTimerComplete = useCallback(() => {
        if (isResting) {
            setIsResting(false);
            setCurrentDrillIndex(prev => prev + 1);
        } else {
            if (currentDrillIndex < routine.drills.length - 1) {
                setIsResting(true);
            } else {
                setIsSessionRunning(false);
                navigate(`/summary`, { state: { routineId: routine.id } });
            }
        }
    }, [isResting, currentDrillIndex, routine, navigate]);

    const handleStartResume = () => {
        setIsSessionRunning(true);
        if (!sessionStarted) {
            setSessionStarted(true);
        }
    };
    
    const onTick = useCallback(() => {
        setCurrentTime(prev => prev - 1);
    }, []);

    const toggleSetting = (setting) => {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };

    if (loading) return <div className="text-center text-white">Loading routine...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!routine) return <div className="text-center text-white">Routine not found.</div>;

    const currentDrill = routine.drills[currentDrillIndex];
    let mainText = sessionStarted ? "Paused" : "Ready?";
    let subText = `First drill: ${routine.drills[0].drill.name}`;

    if (isSessionRunning && currentDrill) {
        if (isResting) {
            mainText = "Rest";
            subText = `Next up: ${routine.drills[currentDrillIndex + 1].drill.name}`;
        } else {
            mainText = currentDrill.drill.name;
            subText = currentDrill.drill.description;
        }
    }

    const bgColor = isSessionRunning && !isResting ? 'bg-green-800' : 'bg-blue-800';

    return (
        <div className={`transition-colors duration-500 ${isSessionRunning ? bgColor : 'bg-gray-900'} min-h-screen text-white text-center p-4 flex flex-col justify-between`}>
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">{routine.name}</h1>
                <p className="text-md text-gray-300">
                    {isSessionRunning ? `Drill ${currentDrillIndex + 1} of ${routine.drills.length}` : 'Session Paused'}
                </p>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center py-2">
                {isSessionRunning ? (
                    <>
                        <p className="text-3xl font-bold mb-2">{mainText}</p>
                        <Timer
                            duration={totalDuration}
                            currentTime={currentTime}
                            onTick={onTick}
                            onComplete={handleTimerComplete}
                            isRunning={isSessionRunning}
                            isResting={isResting}
                            textToSpeak={textToSpeak}
                            settings={settings}
                            speechSpoken={speechSpoken}
                            setSpeechSpoken={setSpeechSpoken}
                        />
                        <p className="text-lg text-gray-300 mt-2 px-2">{subText}</p>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-3xl font-bold mb-4">{mainText}</p>
                        <p className="text-lg mb-6">{subText}</p>
                        <button onClick={handleStartResume} className="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                            {sessionStarted ? 'RESUME' : 'START SESSION'}
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 flex justify-between items-center">
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
                <div>
                    {isSessionRunning && (
                         <button onClick={() => setIsSessionRunning(false)} className="px-6 py-2 font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700">
                            Pause
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPlayerPage;