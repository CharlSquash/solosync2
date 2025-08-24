// src/components/DrillCard.js
import React from 'react';

const DrillCard = ({ drill }) => {
    // Function to extract YouTube video ID from various URL formats, including Shorts
    const getYouTubeId = (url) => {
        if (!url) return null;
        // This updated regex handles youtu.be, /watch, /embed, and now /shorts
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // The data structure from your serializer is nested: RoutineDrill -> Drill
    const videoId = getYouTubeId(drill.drill.youtube_link);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white">{drill.drill.name}</h3>
                <p className="text-gray-400">{drill.drill.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                    Duration: {drill.duration_minutes} min, Rest: {drill.rest_duration_seconds} sec
                </p>
            </div>
            {/* This section will now render correctly for Shorts links */}
            {videoId && (
                <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 flex-shrink-0"
                >
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                        alt="YouTube thumbnail"
                        className="w-24 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    />
                </a>
            )}
        </div>
    );
};

export default DrillCard;