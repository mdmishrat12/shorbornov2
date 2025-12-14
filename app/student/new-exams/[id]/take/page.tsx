// app/student/new-exams/[id]/take/page.tsx - FIXED & SIMPLIFIED
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const examId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (status === 'authenticated' && examId) {
      startExam();
    }
  }, [status, examId, router]);

  const startExam = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting exam:', examId);

      // Call the start endpoint which handles everything
      const response = await fetch(`/api/exams/${examId}/start`, {
        method: 'POST',
      });

      const result = await response.json();
      console.log('Start exam result:', result);

      if (!result.success) {
        setError(result.message || 'Failed to start exam');
        setLoading(false);
        return;
      }

      // Get the attempt ID
      const newAttemptId = result.data?.attempt?.id;
      
      if (!newAttemptId) {
        setError('No attempt ID returned');
        setLoading(false);
        return;
      }

      console.log('Exam started, attempt ID:', newAttemptId);
      setAttemptId(newAttemptId);

      // Redirect to the attempt page
      router.push(`/student/new-exams/${examId}/attempt/${newAttemptId}`);
      
    } catch (err) {
      console.error('Error starting exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to start exam');
      setLoading(false);
    }
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Starting exam...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your exam</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Cannot Start Exam</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          
          <div className="space-y-3">
            <Link
              href={`/student/new-exams/${examId}`}
              className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Exam Details
            </Link>
            <Link
              href="/student/new-exams"
              className="inline-block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Browse Exams
            </Link>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                startExam();
              }}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This should never show because we redirect immediately after getting attemptId
  return null;
}