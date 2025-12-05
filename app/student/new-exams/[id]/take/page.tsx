// app/exams/[examId]/take/page.tsx - UPDATED
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, AlertCircle, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import ExamInterface from '@/components/new-exams/ExamInterface';

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [examId, setExamId] = useState<string>('');
  const [attemptId, setAttemptId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [examData, setExamData] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (status === 'authenticated' && params.examId) {
      const id = params.examId as string;
      const attempt = searchParams.get('attempt');
      
      setExamId(id);
      setAttemptId(attempt || '');
      
      if (attempt) {
        // Check existing attempt status
        checkAttemptStatus(id, attempt);
      } else {
        // Check if user can start a new attempt
        checkExamAccess(id);
      }
    }
  }, [status, params.examId, searchParams, router]);

  const checkExamAccess = async (examId: string) => {
    try {
      setLoading(true);
      setAccessError(null);
      
      const response = await fetch(`/api/exams/${examId}/access`);
      const result = await response.json();
      
      if (!result.success) {
        setAccessError(result.message || 'Cannot access this exam');
        setExamData(result.data);
        return;
      }
      
      setExamData(result.data);
    } catch (error) {
      console.error('Error checking exam access:', error);
      setAccessError('Failed to verify exam access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkAttemptStatus = async (examId: string, attemptId: string) => {
    try {
      setLoading(true);
      setAccessError(null);
      
      const response = await fetch(`/api/exams/${examId}/attempt/${attemptId}/status`);
      const result = await response.json();
      
      if (!result.success) {
        setAccessError(result.message || 'Cannot access this exam attempt');
        setExamData(result.data);
        return;
      }
      
      if (!result.data.canResume) {
        setAccessError('This exam attempt cannot be resumed');
      }
      
      setExamData(result.data);
    } catch (error) {
      console.error('Error checking attempt status:', error);
      setAccessError('Failed to verify attempt status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (accessError || !examId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Cannot Access Exam</h2>
          <p className="text-gray-600 mb-6 text-center">{accessError}</p>
          
          {examData?.exam && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{examData.exam.title}</h3>
              {examData.exam.scheduledStart && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Starts: {formatDate(examData.exam.scheduledStart)}</span>
                </div>
              )}
              {examData.exam.scheduledEnd && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Ends: {formatDate(examData.exam.scheduledEnd)}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
            <Link
              href="/exams"
              className="inline-block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Browse Exams
            </Link>
            {examData?.canStart === false && examData?.availableAt && (
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Check Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state - render exam interface
  return (
    <div className="min-h-screen bg-gray-50">
      <ExamInterface 
        examId={examId} 
        attemptId={attemptId || undefined}
      />
    </div>
  );
}