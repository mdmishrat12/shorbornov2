// components/exams/ExamTimer.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ExamTimerProps {
  examId: string;
  attemptId: string;
  scheduledEndAt: Date;
  duration: number; // in minutes
  onTimeUpdate?: (remainingTime: number) => void;
  onAutoSubmit?: () => Promise<void>;
  showWarningAt?: number; // seconds before warning
  warningMessage?: string;
}

export function ExamTimer({
  examId,
  attemptId,
  scheduledEndAt,
  duration,
  onTimeUpdate,
  onAutoSubmit,
  showWarningAt = 300, // 5 minutes
  warningMessage = 'Time is running out!',
}: ExamTimerProps) {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const calculateRemainingTime = useCallback(() => {
    const now = new Date().getTime();
    const end = new Date(scheduledEndAt).getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [scheduledEndAt]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const autoSubmitExam = useCallback(async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Save any unsaved answers first
      if (typeof window !== 'undefined') {
        const event = new Event('saveAllAnswers');
        window.dispatchEvent(event);
      }

      // Wait a moment for saves to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Auto-submit the exam
      const response = await fetch(`/api/exams/${examId}/attempt/${attemptId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Show submission confirmation
        alert('Exam has been automatically submitted due to time limit.');
        
        // Redirect to results or dashboard
        if (result.data?.showResult) {
          router.push(`/exams/${examId}/results/${attemptId}`);
        } else {
          router.push(`/exams/${examId}/submitted`);
        }
      } else {
        console.error('Auto-submit failed:', result.message);
        alert('Failed to auto-submit exam. Please contact administrator.');
      }
    } catch (error) {
      console.error('Auto-submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, attemptId, router, isSubmitting]);

  useEffect(() => {
    // Calculate initial remaining time
    const initialTime = calculateRemainingTime();
    setRemainingTime(initialTime);
    
    // Update warning states
    setIsWarning(initialTime <= showWarningAt);
    setIsCritical(initialTime <= 60); // Last minute

    // Start timer
    const timer = setInterval(() => {
      const newTime = calculateRemainingTime();
      setRemainingTime(newTime);
      
      // Update warning states
      setIsWarning(newTime <= showWarningAt);
      setIsCritical(newTime <= 60);
      
      // Call time update callback
      onTimeUpdate?.(newTime);
      
      // Auto-submit when time reaches zero
      if (newTime <= 0) {
        clearInterval(timer);
        autoSubmitExam();
      }
    }, 1000);

    // Auto-save answers periodically
    const autoSaveInterval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const event = new Event('saveAllAnswers');
        window.dispatchEvent(event);
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(timer);
      clearInterval(autoSaveInterval);
    };
  }, [calculateRemainingTime, onTimeUpdate, autoSubmitExam, showWarningAt]);

  // Show warning modal when time is low
  useEffect(() => {
    if (remainingTime === showWarningAt && warningMessage) {
      alert(warningMessage);
    }
  }, [remainingTime, showWarningAt, warningMessage]);

  const getTimerColor = () => {
    if (isCritical) return 'text-red-600';
    if (isWarning) return 'text-orange-600';
    return 'text-green-600';
  };

  const getTimerBgColor = () => {
    if (isCritical) return 'bg-red-100';
    if (isWarning) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const handleManualSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the exam?')) {
      await autoSubmitExam();
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${getTimerBgColor()} p-4 rounded-lg shadow-lg border`}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${getTimerColor()} mb-2`}>
          {formatTime(remainingTime)}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          Time Remaining
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleManualSubmit}
            disabled={isSubmitting || remainingTime <= 0}
            className={`w-full px-4 py-2 rounded-lg font-medium ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
          
          {remainingTime <= 300 && (
            <div className="text-xs text-red-600 font-medium">
              ⚠️ Auto-submit in {formatTime(remainingTime)}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Auto-save: Every 30 seconds
        </div>
      </div>
    </div>
  );
}