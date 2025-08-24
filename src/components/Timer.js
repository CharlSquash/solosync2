// src/components/Timer.js
import React, { useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({
    duration,
    currentTime,
    onTick,
    onComplete,
    isRunning,
    isResting,
    textToSpeak,
    settings,
    speechSpoken,
    setSpeechSpoken
}) => {

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        // Text-to-speech logic now uses the speechSpoken prop
        if (settings.speechEnabled && textToSpeak && !speechSpoken) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
            setSpeechSpoken(true); // Update the parent's state
        }
        
        // Start chime logic also uses the speechSpoken prop
        if (settings.soundEnabled && !speechSpoken) {
            const audio = new Audio('/sounds/start_chime.mp3');
            audio.play();
        }

        const interval = setInterval(() => {
            if (currentTime <= 1) {
                clearInterval(interval);
                if (settings.soundEnabled) {
                    const audio = new Audio('/sounds/end_chime.mp3');
                    audio.play();
                }
                onComplete();
            } else {
                onTick();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, currentTime, onTick, onComplete, settings, speechSpoken, setSpeechSpoken, textToSpeak]);

    const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const displayText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    const pathColor = isResting ? '#3B82F6' : '#10B981'; // Blue for rest, Green for drill

    return (
        <div style={{ width: 200, height: 200, margin: 'auto' }}>
            <CircularProgressbar
                value={percentage}
                text={displayText}
                styles={buildStyles({
                    textColor: 'white',
                    pathColor: pathColor,
                    trailColor: '#324A5F',
                })}
            />
        </div>
    );
};

export default Timer;