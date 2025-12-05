'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  endTime: string;
  onTimeUp?: () => void;
}

export default function Timer({ endTime, onTimeUp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const end = new Date(endTime).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && onTimeUp) {
        onTimeUp();
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    if (timeRemaining < 300) return 'text-red-600';
    if (timeRemaining < 600) return 'text-yellow-600';
    return 'text-gray-900';
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`w-5 h-5 ${getColor()}`} />
      <span className={`text-lg font-mono font-semibold ${getColor()} ${timeRemaining < 300 ? 'animate-pulse' : ''}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}