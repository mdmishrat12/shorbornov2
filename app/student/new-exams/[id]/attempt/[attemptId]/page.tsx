// app/student/new-exams/[id]/results/[attemptId]/page.tsx - FIXED
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Target,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface AttemptData {
  id: string;
  examId: string;
  userId: string;
  status: string;
  startedAt: string;
  submittedAt: string;
  timeSpent: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  finalScore: number;
  percentage: number;
  result: string;
  rank: number;
  percentile: number;
}

interface ExamData {
  id: string;
  title: string;
  passingScore: number;
  showAnswersAfterExam: boolean;
  showLeaderboard: boolean;
}

interface QuestionData {
  id: string;
  questionNumber: number;
  question: string;
  options: Array<{ option: string; text: string }>;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [results, setResults] = useState<AttemptData | null>(null);
  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Extract params correctly
  const examId = params.id as string;
  const attemptId = params.attemptId as string;

  useEffect(() => {
    console.log('Results page params:', { examId, attemptId });

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && examId && attemptId) {
      if (examId === 'undefined' || !examId) {
        console.error('Exam ID is undefined!');
        setError('Invalid exam ID');
        setLoading(false);
        return;
      }
      fetchResults();
    }
  }, [status, examId, attemptId, router]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching results for:', { examId, attemptId });

      // FIXED: Use correct endpoint with proper exam ID
      const response = await fetch(
        `/api/exams/${examId}/attempt/${attemptId}/results`
      );

      console.log('Results response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const result = await response.json();
      console.log('Results data:', result);

      if (result.success) {
        setResults(result.data.attempt);
        setExam(result.data.exam);
        setQuestions(result.data.questions || []);
      } else {
        throw new Error(result.message || 'Failed to load results');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error instanceof Error ? error.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !results || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The requested results could not be loaded.'}
          </p>
          <div className="space-y-2">
            <Link
              href="/student/new-exams"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Exams
            </Link>
            <button
              onClick={fetchResults}
              className="ml-2 inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPassed = results.result === 'pass';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link
                href="/student/new-exams"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Exams
              </Link>
              <h1 className="text-2xl font-bold">Exam Results</h1>
              <p className="text-gray-600">{exam.title}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Result Status Card */}
        <div className={`rounded-lg p-8 mb-8 text-center ${
          isPassed 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200'
        }`}>
          <div className="flex justify-center mb-4">
            {isPassed ? (
              <CheckCircle className="w-20 h-20 text-green-600" />
            ) : (
              <XCircle className="w-20 h-20 text-red-600" />
            )}
          </div>
          <h2 className={`text-4xl font-bold mb-2 ${
            isPassed ? 'text-green-700' : 'text-red-700'
          }`}>
            {isPassed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {isPassed 
              ? 'You have passed the exam!' 
              : 'You did not meet the passing score this time.'}
          </p>
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {results.percentage}%
          </div>
          <p className="text-gray-600">
            {results.finalScore} out of {results.totalQuestions} marks
          </p>
        </div>

        {/* Score Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Correct Answers</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{results.correctAnswers}</p>
            <p className="text-sm text-gray-500">out of {results.totalQuestions}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Your Rank</h3>
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">#{results.rank}</p>
            <p className="text-sm text-gray-500">{results.percentile}th percentile</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Time Taken</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(results.timeSpent / 60)}m
            </p>
            <p className="text-sm text-gray-500">{formatTime(results.timeSpent)}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {results.attemptedQuestions > 0 
                ? Math.round((results.correctAnswers / results.attemptedQuestions) * 100)
                : 0}%
            </p>
            <p className="text-sm text-gray-500">
              {results.incorrectAnswers} incorrect
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Correct Answers</span>
                <span className="font-medium text-green-600">
                  {results.correctAnswers} ({Math.round((results.correctAnswers / results.totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(results.correctAnswers / results.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Incorrect Answers</span>
                <span className="font-medium text-red-600">
                  {results.incorrectAnswers} ({Math.round((results.incorrectAnswers / results.totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(results.incorrectAnswers / results.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Skipped Questions</span>
                <span className="font-medium text-gray-600">
                  {results.skippedQuestions} ({Math.round((results.skippedQuestions / results.totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full"
                  style={{ width: `${(results.skippedQuestions / results.totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Answers Review (if allowed) */}
        {exam.showAnswersAfterExam && questions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Answer Review</h3>
            <div className="space-y-4">
              {questions.map((q) => (
                <div 
                  key={q.id}
                  className={`border rounded-lg p-4 ${
                    q.isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      Question {q.questionNumber}
                    </h4>
                    {q.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{q.question}</p>
                  
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isUserAnswer = opt.option === q.userAnswer;
                      const isCorrectAnswer = opt.option === q.correctAnswer;
                      
                      return (
                        <div 
                          key={opt.option}
                          className={`p-3 rounded ${
                            isCorrectAnswer
                              ? 'bg-green-100 border border-green-300'
                              : isUserAnswer
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{opt.option}.</span> {opt.text}
                          {isCorrectAnswer && (
                            <span className="ml-2 text-xs text-green-700 font-medium">
                              (Correct Answer)
                            </span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="ml-2 text-xs text-red-700 font-medium">
                              (Your Answer)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/student/new-exams/${examId}`}
            className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow text-center"
          >
            <h4 className="font-medium mb-2">View Exam Details</h4>
            <p className="text-sm text-gray-600">See exam schedule and rules</p>
          </Link>
          
          {exam.showLeaderboard && (
            <Link
              href={`/student/new-exams/${examId}/leaderboard`}
              className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow text-center"
            >
              <h4 className="font-medium mb-2">View Leaderboard</h4>
              <p className="text-sm text-gray-600">Compare your score with others</p>
            </Link>
          )}
          
          <Link
            href="/student/new-exams"
            className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow text-center"
          >
            <h4 className="font-medium mb-2">Try Similar Exams</h4>
            <p className="text-sm text-gray-600">Practice with similar questions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}