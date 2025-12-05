// components/study-timer.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Clock } from "lucide-react";

interface StudyTimerProps {
  onTimeUpdate: (minutes: number) => void;
}

export function StudyTimer({ onTimeUpdate }: StudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    // Update every minute
    if (time > 0 && time % 60 === 0) {
      onTimeUpdate(time / 60);
    }
  }, [time, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSessionTime(0);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          স্টাডি টাইমার
        </CardTitle>
        <CardDescription>
          আপনার আজকের পড়ার সময় ট্র্যাক করুন
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-green-600">
            {formatTime(sessionTime)}
          </div>
          <div className="text-xs text-gray-600">বর্তমান সেশন</div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {!isRunning ? (
            <Button size="sm" onClick={handleStart}>
              <Play className="h-4 w-4 mr-1" />
              শুরু করুন
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handlePause}>
              <Pause className="h-4 w-4 mr-1" />
              বিরতি
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleStop}>
            <Square className="h-4 w-4 mr-1" />
            বন্ধ করুন
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>আজকের লক্ষ্য: 3 ঘন্টা</span>
            <span>{Math.floor(time / 3600)} ঘন্টা</span>
          </div>
          <Progress value={(time / (3 * 3600)) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}