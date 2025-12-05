'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ExamDetails {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  accessType: string;
  maxAttempts: number;
  retakeDelay: number;
  totalRegistered: number;
  totalAttempted: number;
  passingScore: number;
}

export default function ExamRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (examId) {
      fetchExamDetails();
    }
  }, [status, router, examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/exams/${examId}`);
      const data = await response.json();
      if (data.success) {
        setExam(data.data);
      } else {
        setError('Exam not found');
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      setError('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!exam) return;

    // Validate password for private exams
    if (exam.accessType === 'private' && !password.trim()) {
      setError('Password is required');
      return;
    }

    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/exams/${examId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        // Refresh exam details to update registration count
        fetchExamDetails();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/exams/${examId}`);
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Failed to register for exam');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExamOpen = () => {
    if (!exam) return false;
    const now = new Date();
    const start = new Date(exam.scheduledStart);
    const end = new Date(exam.scheduledEnd);
    return now >= start && now <= end && exam.status === 'live';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Exam Not Found</h1>
        <p className="mt-2 text-gray-600">The exam you're looking for doesn't exist.</p>
        <Link
          href="/exams"
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Back to Exams
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/exams/${examId}`}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Exam Details
          </Link>
        </div>

        {/* Registration Card */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Register for Exam</h1>
              <p className="mt-2 text-gray-600">
                Complete your registration to participate in this exam
              </p>
            </div>

            {/* Exam Details */}
            <div className="p-6 mt-8 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
              <p className="mt-2 text-gray-600">{exam.description}</p>
              
              <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
                <div className="flex items-center">
                  <Calendar className="flex-shrink-0 w-5 h-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Start Time</p>
                    <p className="text-sm text-gray-900">{formatDate(exam.scheduledStart)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="flex-shrink-0 w-5 h-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-sm text-gray-900">{exam.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="flex-shrink-0 w-5 h-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Registered</p>
                    <p className="text-sm text-gray-900">{exam.totalRegistered} participants</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5">
                    {exam.accessType === 'private' ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Access</p>
                    <p className="text-sm text-gray-900">
                      {exam.accessType === 'private' ? 'Password Protected' : 'Public'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6">
                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Exam Code</span>
                  <span className="text-sm text-gray-900 font-mono">{exam.code}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Max Attempts</span>
                  <span className="text-sm text-gray-900">{exam.maxAttempts}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Passing Score</span>
                  <span className="text-sm text-gray-900">{exam.passingScore}%</span>
                </div>
              </div>
            </div>

            {/* Password Input for Private Exams */}
            {exam.accessType === 'private' && (
              <div className="mt-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Exam Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter exam password"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You need the password to register for this private exam
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 mt-4 text-red-800 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center p-4 mt-4 text-green-800 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{success}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8">
              {!isExamOpen() ? (
                <div className="p-4 text-yellow-800 bg-yellow-100 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">Exam is not currently open</p>
                      <p className="text-sm">
                        You can register now, but the exam will only be available from{' '}
                        {formatDate(exam.scheduledStart)} to {formatDate(exam.scheduledEnd)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3 mt-6">
                <Link
                  href={`/exams/${examId}`}
                  className="flex-1 px-4 py-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register for Exam'
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  By registering, you agree to the exam rules and regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}