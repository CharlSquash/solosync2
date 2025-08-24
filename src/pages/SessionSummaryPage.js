import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionSummaryPage = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();

    const [duration, setDuration] = useState('');
    const [exertion, setExertion] = useState(5);
    const [focus, setFocus] = useState(5);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!duration || parseInt(duration) <= 0) {
            setError("Please enter a valid session duration.");
            setIsSubmitting(false);
            return;
        }

        const sessionData = {
            routine: routineId,
            duration_minutes: parseInt(duration),
            exertion_rating: exertion,
            focus_rating: focus,
            notes: notes,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/solosync2/logs/', sessionData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError('Failed to save session. Please try again.');
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Session Summary</h1>
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Actual Duration (minutes)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="e.g., 30"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="exertion" className="block text-sm font-medium text-gray-700">
                        Perceived Exertion: <span className="font-bold">{exertion}</span>
                    </label>
                    <input
                        type="range"
                        id="exertion"
                        min="1"
                        max="10"
                        value={exertion}
                        onChange={(e) => setExertion(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <label htmlFor="focus" className="block text-sm font-medium text-gray-700">
                        Focus Level: <span className="font-bold">{focus}</span>
                    </label>
                    <input
                        type="range"
                        id="focus"
                        min="1"
                        max="10"
                        value={focus}
                        onChange={(e) => setFocus(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Session Notes
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="How did you feel? What went well? What could be improved?"
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Saving...' : 'Save Session'}
                </button>
            </form>
        </div>
    );
};

export default SessionSummaryPage;