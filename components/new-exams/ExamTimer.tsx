// components/exam/ExamTimer.tsx
'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface ExamTimerProps {
  duration: number; // in minutes
  startedAt: Date | string;
  onTimeExpired: () => void;
  showTimer: boolean;
}

export default function ExamTimer({ 
  duration, 
  startedAt, 
  onTimeExpired,
  showTimer 
}: ExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (!showTimer || !startedAt) return;

    const startTime = new Date(startedAt);
    const totalTime = duration * 60; // Convert to seconds
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const updateTimer = () => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(remaining);
      
      // Set warning states
      setIsWarning(remaining <= 300 && remaining > 60); // 5 minutes
      setIsCritical(remaining <= 60);
      
      if (remaining <= 0) {
        onTimeExpired();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [duration, startedAt, onTimeExpired, showTimer]);

  if (!showTimer) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className={`p-4 rounded-lg border ${
      isCritical 
        ? 'bg-red-50 border-red-200 text-red-700' 
        : isWarning 
          ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
          : 'bg-blue-50 border-blue-200 text-blue-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Time Remaining:</span>
        </div>
        <div className={`text-2xl font-bold font-mono ${
          isCritical ? 'animate-pulse' : ''
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {isCritical && (
        <div className="flex items-center gap-2 mt-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Time is almost up! Answers will be auto-submitted.</span>
        </div>
      )}
      
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isCritical 
                ? 'bg-red-500' 
                : isWarning 
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>0%</span>
          <span>Elapsed: {Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}