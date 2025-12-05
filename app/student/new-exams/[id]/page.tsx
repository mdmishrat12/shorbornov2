'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Trophy,
  Lock,
  Play,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
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
  bufferTime: number;
  accessType: string;
  maxAttempts: number;
  retakeDelay: number;
  enableProctoring: boolean;
  requireWebcam: boolean;
  requireMicrophone: boolean;
  allowTabSwitch: boolean;
  maxTabSwitches: number;
  showQuestionNumbers: boolean;
  showTimer: boolean;
  showRemainingQuestions: boolean;
  allowQuestionNavigation: boolean;
  allowQuestionReview: boolean;
  allowAnswerChange: boolean;
  showResultImmediately: boolean;
  showAnswersAfterExam: boolean;
  showLeaderboard: boolean;
  resultReleaseTime: string | null;
  passingScore: number;
  gradingMethod: string;
  allowNegativeMarking: boolean;
  negativeMarkingPerQuestion: number;
  totalRegistered: number;
  totalAttempted: number;
  averageScore: number;
  createdBy: string;
  questionPaperId: string;
  questionPaper?: {
    title: string;
    totalQuestions: number;
    totalMarks: number;
    duration: number;
  };
  isRegistered?: boolean;
  isCreator?: boolean;
  attempts?: any[];
}

export default function ExamDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated' && examId) {
      fetchExamDetails();
    }
  }, [status, router, examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/exams/${examId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Exam not found');
        }
        throw new Error('Failed to fetch exam details');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setExam(data.data);
      } else {
        setError(data.message || 'Failed to load exam');
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      setError(error instanceof Error ? error.message : 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (!exam) return;

    setStarting(true);
    try {
      const response = await fetch(`/api/exams/${examId}/start`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        if (data.resume && data.data) {
          // Resume existing attempt
          router.push(`/student/new-exams/${examId}/attempt/${data.data.id}`);
        } else if (data.data?.attempt) {
          // Start new attempt
          router.push(`/student/new-exams/${examId}/attempt/${data.data.attempt.id}`);
        }
      } else {
        alert(data.message || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam');
    } finally {
      setStarting(false);
    }
  };

  const handleDeleteExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/exams');
      } else {
        alert(data.message || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam');
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

  const getTimeRemaining = () => {
    if (!exam) return null;
    const now = new Date();
    const start = new Date(exam.scheduledStart);
    const end = new Date(exam.scheduledEnd);

    if (now < start) {
      const diff = start.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Starts in ${days} days ${hours} hours`;
    } else if (now > end) {
      return 'Exam ended';
    } else {
      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
  };

  const canStartExam = () => {
    if (!exam) return false;
    const now = new Date();
    const start = new Date(exam.scheduledStart);
    const end = new Date(exam.scheduledEnd);
    return now >= start && now <= end && exam.status === 'live';
  };

  const isCreator = session?.user?.id === exam?.createdBy;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/exams"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Exams
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Exam Not Found</h1>
            <p className="mt-2 text-gray-600">
              {error || 'The exam you are looking for does not exist or you do not have access to it.'}
            </p>
            <div className="mt-6">
              <Link
                href="/exams"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/exams"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Exams
          </Link>
          <div className="flex flex-col justify-between mt-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
              <p className="mt-2 text-gray-600">{exam.description}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {isCreator && (
                <>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={() => router.push(`/student/new-exams/${examId}/edit`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Registered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exam.totalRegistered}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Attempted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exam.totalAttempted}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-purple-600 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exam.averageScore}%
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-orange-600 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.status === 'live'
                        ? 'bg-green-100 text-green-800'
                        : exam.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : exam.status === 'completed'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {exam.status.replace('_', ' ')}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {getTimeRemaining()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Exam Details */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">Exam Details</h2>
              
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-900">
                        <strong>Start:</strong> {formatDate(exam.scheduledStart)}
                      </p>
                      <p className="text-sm text-gray-900">
                        <strong>End:</strong> {formatDate(exam.scheduledEnd)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1 text-sm text-gray-900">{exam.duration} minutes</p>
                    {exam.bufferTime > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        + {exam.bufferTime} minutes buffer time
                      </p>
                    )}
                  </div>
                </div>

                {exam.questionPaper && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Question Paper</h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">{exam.questionPaper.title}</h4>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                        <span>{exam.questionPaper.totalQuestions} questions</span>
                        <span>•</span>
                        <span>{exam.questionPaper.totalMarks} marks</span>
                        <span>•</span>
                        <span>{exam.questionPaper.duration} min duration</span>
                      </div>
                      <Link
                        href={`/question-papers/${exam.questionPaperId}`}
                        className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Question Paper
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Access Settings</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">
                      <strong>Access Type:</strong>{' '}
                      <span className="capitalize">{exam.accessType}</span>
                      {exam.accessType === 'private' && (
                        <Lock className="inline w-4 h-4 ml-1 text-gray-400" />
                      )}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Max Attempts:</strong> {exam.maxAttempts}
                    </p>
                    {exam.retakeDelay > 0 && (
                      <p className="text-sm text-gray-900">
                        <strong>Retake Delay:</strong> {exam.retakeDelay} hours
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Grading</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">
                      <strong>Passing Score:</strong> {exam.passingScore}%
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Grading Method:</strong>{' '}
                      <span className="capitalize">{exam.gradingMethod}</span>
                    </p>
                    {exam.allowNegativeMarking && (
                      <p className="text-sm text-gray-900">
                        <strong>Negative Marking:</strong>{' '}
                        {exam.negativeMarkingPerQuestion} marks per wrong answer
                      </p>
                    )}
                  </div>
                </div>

                {exam.enableProctoring && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Proctoring Settings</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-900">
                        {exam.requireWebcam && '✓ Webcam Required • '}
                        {exam.requireMicrophone && '✓ Microphone Required • '}
                        {!exam.allowTabSwitch && `Max ${exam.maxTabSwitches} tab switches`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
              
              <div className="mt-6 space-y-4">
                {canStartExam() ? (
                  <button
                    onClick={handleStartExam}
                    disabled={starting}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Exam Now
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 text-yellow-800 bg-yellow-100 rounded-lg">
                    <div className="flex">
                      <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
                      <p className="text-sm">
                        Exam {new Date() < new Date(exam.scheduledStart) ? 'starts' : 'ended'} on{' '}
                        {formatDate(exam.scheduledStart)}
                      </p>
                    </div>
                  </div>
                )}

                {!exam.isRegistered && (
                  <Link
                    href={`/student/new-exams/${examId}/register`}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Register for Exam
                  </Link>
                )}

                {exam.showLeaderboard && (
                  <Link
                    href={`/student/new-exams/${examId}/leaderboard`}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Link>
                )}

                <Link
                  href={`/student/new-exams/${examId}/results`}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Results
                </Link>
              </div>

              {/* Quick Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Quick Info</h3>
                <dl className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Exam Code</dt>
                    <dd className="text-sm font-mono text-gray-900">{exam.code}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {exam.status.replace('_', ' ')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Created By</dt>
                    <dd className="text-sm text-gray-900">
                      {isCreator ? 'You' : 'Other User'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}