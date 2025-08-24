// src/components/StreakDisplay.js
import React from 'react';
import { differenceInCalendarDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const calculateStreaks = (logDates) => {
    if (logDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0, weeklyCount: 0 };
    }

    const sortedDates = logDates.map(d => new Date(d)).sort((a, b) => a - b);
    const uniqueDates = sortedDates.filter((date, i, self) =>
        i === self.findIndex(d => isSameDay(d, date))
    );

    let currentStreak = 0;
    let longestStreak = 0;

    if (uniqueDates.length > 0) {
        const today = new Date();
        const lastLogDate = uniqueDates[uniqueDates.length - 1];

        if (differenceInCalendarDays(today, lastLogDate) <= 1) {
            currentStreak = 1;
            for (let i = uniqueDates.length - 2; i >= 0; i--) {
                if (differenceInCalendarDays(uniqueDates[i + 1], uniqueDates[i]) === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
    }

    let tempCurrentStreak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
            tempCurrentStreak = 1;
        } else {
            if (differenceInCalendarDays(uniqueDates[i], uniqueDates[i - 1]) === 1) {
                tempCurrentStreak++;
            } else {
                tempCurrentStreak = 1;
            }
        }
        if (tempCurrentStreak > longestStreak) {
            longestStreak = tempCurrentStreak;
        }
    }
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }


    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start, end });

    let weeklyCount = 0;
    weekDays.forEach(day => {
        if (uniqueDates.some(logDate => isSameDay(logDate, day))) {
            weeklyCount++;
        }
    });

    return { currentStreak, longestStreak, weeklyCount };
};


const StreakDisplay = ({ logs }) => {
    const logDates = logs.map(log => log.completed_at);
    const { currentStreak, longestStreak, weeklyCount } = calculateStreaks(logDates);

    return (
        <div className="bg-primary p-4 rounded-lg shadow-md mb-6 text-white">
            <h2 className="text-xl font-bold mb-4 text-center">My Stats</h2>
            <div className="flex justify-around text-center">
                <div>
                    <span role="img" aria-label="fire" className="text-4xl">🔥</span>
                    <p className="text-lg font-semibold">{currentStreak}</p>
                    <p className="text-sm text-gray-400">Current Streak</p>
                </div>
                <div>
                    <span role="img" aria-label="trophy" className="text-4xl">🏆</span>
                    <p className="text-lg font-semibold">{longestStreak}</p>
                    <p className="text-sm text-gray-400">Longest Streak</p>
                </div>
                <div>
                     <span role="img" aria-label="calendar" className="text-4xl">🗓️</span>
                    <p className="text-lg font-semibold">{weeklyCount}/7</p>
                    <p className="text-sm text-gray-400">This Week</p>
                </div>
            </div>
        </div>
    );
};

export default StreakDisplay;