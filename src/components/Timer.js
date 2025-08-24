// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ initialSeconds, onComplete, isRunning, isResting, textToSpeak, settings }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [speechSpoken, setSpeechSpoken] = useState(false);

    useEffect(() => {
        setSecondsLeft(initialSeconds);
        setSpeechSpoken(false); // Reset speech flag when the timer changes
    }, [initialSeconds]);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        // Text-to-speech logic
        if (settings.speechEnabled && textToSpeak && !speechSpoken) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
            setSpeechSpoken(true);
        }

        // Sound chime logic
        if (settings.soundEnabled) {
            const audio = new Audio('/sounds/start_chime.mp3');
            audio.play();
        }

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (settings.soundEnabled) {
                        const audio = new Audio('/sounds/end_chime.mp3');
                        audio.play();
                    }
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, onComplete, settings, textToSpeak, speechSpoken, initialSeconds]);

    const percentage = (initialSeconds - secondsLeft) / initialSeconds * 100;
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const displayText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    const pathColor = isResting ? '#3B82F6' : '#10B981'; // Blue for rest, Green for drill

    return (
        <div style={{ width: 250, height: 250, margin: 'auto' }}>
            <CircularProgressbar
                value={percentage}
                text={displayText}
                styles={buildStyles({
                    textColor: 'white',
                    pathColor: pathColor,
                    trailColor: '#324A5F', // accent color
                })}
            />
        </div>
    );
};

export default Timer;