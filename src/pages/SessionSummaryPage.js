import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionSummaryPage = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();

    const [difficulty, setDifficulty] = useState(3);
    const [likelihood, setLikelihood] = useState(3);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const sessionData = {
            routine: routineId,
            difficulty_rating: difficulty,
            likelihood_rating: likelihood,
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
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                        Difficulty: <span className="font-bold">{difficulty}</span>
                    </label>
                    <input
                        type="range"
                        id="difficulty"
                        min="1"
                        max="5"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <label htmlFor="likelihood" className="block text-sm font-medium text-gray-700">
                        How likely are you to do this routine again?: <span className="font-bold">{likelihood}</span>
                    </label>
                    <input
                        type="range"
                        id="likelihood"
                        min="1"
                        max="5"
                        value={likelihood}
                        onChange={(e) => setLikelihood(parseInt(e.target.value))}
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