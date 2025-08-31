// src/pages/SessionHistoryPage.js (Corrected)
import React, { useEffect, useState } from 'react';
import api from '../api'; // CHANGED: Use the new api instance
import { format, isSameDay, startOfDay } from 'date-fns';
import StreakDisplay from '../components/StreakDisplay';
import Calendar from 'react-calendar';
import './CalendarOverride.css';

const SessionHistoryPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- FIX IS HERE ---
    // Define the 'selectedDate' state that was missing
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    // The 'calendarDate' state is no longer needed if we use selectedDate for the calendar
    
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // CHANGED: Use the api instance to fetch logs
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

    const completedDates = logs.map(log => startOfDay(new Date(log.completed_at)));

    const filteredLogs = selectedDate 
        ? logs.filter(log => isSameDay(new Date(log.completed_at), selectedDate))
        : [];

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            if (isSelected) {
                return 'bg-blue-500 text-white rounded-full';
            }
        }
        return null;
    };
    
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const isCompleted = completedDates.some(compDate => isSameDay(date, compDate));
            if (isCompleted) {
                return <span className="star">⭐</span>;
            }
        }
        return null;
    };

    if (loading) return <div className="text-center mt-8">Loading history...</div>;
    if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-teal-400">Session History</h1>
            <div className="flex flex-col">
                <div className="w-full">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileClassName={tileClassName}
                        tileContent={tileContent}
                    />
                </div>
                <div className="w-full mt-6">
                    <StreakDisplay logs={logs} />
                    <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
                        Logs for {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
                    </h2>
                    {filteredLogs.length > 0 ? (
                        <ul className="space-y-3">
                            {filteredLogs.map(log => (
                                <li key={log.id} className="bg-gray-800 p-3 rounded-lg">
                                    <p className="font-semibold">{log.routine_name}</p>
                                    <p className="text-sm text-gray-400">
                                        Completed at: {format(new Date(log.completed_at), 'p')}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No sessions logged on this date.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionHistoryPage;