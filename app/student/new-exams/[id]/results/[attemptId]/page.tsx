// app/exams/[examId]/results/[attemptId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ExamResults from '@/components/new-exams/ExamResults';

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [results, setResults] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    fetchResults();
  }, [status, params.examId, params.attemptId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/exams/${params.examId}/attempt/${params.attemptId}/results`
      );
      const result = await response.json();

      if (result.success) {
        setResults(result.data.attempt);
        setQuestions(result.data.questions || []);
      } else {
        router.push('/dashboard?error=' + encodeURIComponent(result.message));
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      router.push('/dashboard?error=Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Results not found</h2>
          <p className="text-gray-600 mb-6">The requested results could not be loaded.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold">Exam Results</h1>
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
        <ExamResults 
          attempt={results}
          exam={{
            title: results.examTitle || 'Exam',
            passingScore: results.passingScore || 40,
            showLeaderboard: true
          }}
          questions={questions}
        />
      </div>

      {/* Related Actions */}
      <div className="container mx-auto px-4 py-8 border-t">
        <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/exams/${params.examId}`}
            className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow"
          >
            <h4 className="font-medium mb-2">View Exam Details</h4>
            <p className="text-sm text-gray-600">See exam schedule, syllabus, and rules</p>
          </Link>
          <Link
            href={`/exams/${params.examId}/leaderboard`}
            className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow"
          >
            <h4 className="font-medium mb-2">View Leaderboard</h4>
            <p className="text-sm text-gray-600">Compare your score with others</p>
          </Link>
          <Link
            href={`/exams/similar`}
            className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow"
          >
            <h4 className="font-medium mb-2">Try Similar Exams</h4>
            <p className="text-sm text-gray-600">Practice with similar question patterns</p>
          </Link>
        </div>
      </div>
    </div>
  );
}