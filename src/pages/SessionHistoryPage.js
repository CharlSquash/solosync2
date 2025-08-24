// src/pages/SessionHistoryPage.js
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api'; 
import Calendar from 'react-calendar';
import StreakDisplay from '../components/StreakDisplay';
import './CalendarOverride.css';

const SessionHistoryPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarDate, setCalendarDate] = useState(new Date());

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/api/solosync2/logs/');
                setLogs(response.data);
            } catch (err) {
                setError('Failed to fetch session history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = new Date(log.completed_at);
            return logDate.toDateString() === selectedDate.toDateString();
        });
    }, [logs, selectedDate]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasLog = logs.some(log =>
                new Date(log.completed_at).toDateString() === date.toDateString()
            );
            if (hasLog) {
                return <span className="text-yellow-400 text-lg absolute top-0 right-1">★</span>;
            }
        }
        return null;
    };

    if (loading) return <div className="text-center text-white">Loading history...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Stats Component at the top */}
            <div className="mb-6">
                <StreakDisplay logs={logs} />
            </div>

            {/* Calendar takes full width */}
            <div className="mb-8">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="react-calendar"
                />
            </div>

            {/* Logs for the selected day appear below */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Logs for {selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </h2>
                {filteredLogs.length === 0 ? (
                    <div className="p-6 text-center bg-primary rounded-lg shadow-md text-gray-400">
                        <p>No sessions logged on this day.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map(log => (
                            <div key={log.id} className="p-6 bg-primary rounded-lg shadow-md text-gray-300">
                                 <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{log.routine}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(log.completed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className="text-lg font-bold text-white">{log.duration_minutes} min</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-400">Exertion</p>
                                        <p className="text-2xl font-bold text-white">{log.exertion_rating}/10</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Focus</p>
                                        <p className="text-2xl font-bold text-white">{log.focus_rating}/10</p>
                                    </div>
                                </div>
                                {log.notes && (
                                    <div className="mt-4 pt-4 border-t border-accent">
                                        <p className="text-gray-300 italic">"{log.notes}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionHistoryPage;