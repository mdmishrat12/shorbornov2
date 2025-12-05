// components/exam/AccessibleExamsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  Award,
  Lock,
  PlayCircle,
  Eye,
  FileText,
  Filter
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description?: string;
  code: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  totalRegistered: number;
  totalAttempted: number;
  passingScore: number;
  status: string;
  registration?: {
    status: string;
    registeredAt: string;
  };
  lastAttempt?: {
    finalScore: number;
    result: string;
  };
  attemptsCount: number;
  canStart: boolean;
}

export default function AccessibleExamsList() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    past: 0
  });

  useEffect(() => {
    fetchExams();
  }, [filter, search]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        filter,
        ...(search && { search })
      });

      const response = await fetch(`/api/exams/accessible?${params}`);
      const result = await response.json();

      if (result.success) {
        setExams(result.data);
        setStats({
          total: result.pagination.total,
          upcoming: result.data.filter((e: Exam) => 
            new Date(e.scheduledStart) > new Date()
          ).length,
          ongoing: result.data.filter((e: Exam) => 
            new Date(e.scheduledStart) <= new Date() && 
            new Date(e.scheduledEnd) >= new Date()
          ).length,
          past: result.data.filter((e: Exam) => 
            new Date(e.scheduledEnd) < new Date()
          ).length
        });
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const start = new Date(exam.scheduledStart);
    const end = new Date(exam.scheduledEnd);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'past';
  };

  const handleStartExam = async (examId: string) => {
    try {
      const response = await fetch(`/api/exams/${examId}/start`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push(`/exams/${examId}/take?attempt=${result.data.attempt.id}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to start exam');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">Your Exams</h1>
        <p className="text-gray-600 mb-6">Access and manage all your registered exams</p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Exams</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{stats.ongoing}</div>
            <div className="text-sm text-gray-600">Ongoing</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-600">{stats.past}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            {['upcoming', 'ongoing', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const status = getExamStatus(exam);
          const hasAttempts = exam.attemptsCount > 0;
          const isRegistered = exam.registration?.status === 'approved';
          
          return (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Status Badge */}
              <div className={`px-4 py-2 text-white ${
                status === 'ongoing' ? 'bg-green-600' :
                status === 'upcoming' ? 'bg-blue-600' :
                'bg-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold capitalize">{status}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {exam.code}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {exam.description || 'No description available'}
                </p>

                {/* Exam Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(exam.scheduledStart)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatDuration(exam.duration)}</span>
                    <span className="text-gray-400">•</span>
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{exam.totalRegistered} registered</span>
                    {exam.totalAttempted > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>{exam.totalAttempted} attempted</span>
                      </>
                    )}
                  </div>
                  {hasAttempts && exam.lastAttempt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span>
                        Last attempt: {exam.lastAttempt.finalScore}% ({exam.lastAttempt.result})
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{exam.attemptsCount} attempt(s)</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {status === 'ongoing' && exam.canStart && (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {hasAttempts ? 'Continue' : 'Start Exam'}
                    </button>
                  )}
                  
                  {status === 'upcoming' && (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4" />
                      Starts Soon
                    </button>
                  )}
                  
                  {status === 'past' && (
                    <button
                      onClick={() => router.push(`/exams/${exam.id}/results`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      View Results
                    </button>
                  )}

                  {hasAttempts && (
                    <button
                      onClick={() => router.push(`/exams/${exam.id}/attempts`)}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Registration Status */}
                {exam.registration && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Registration:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        exam.registration.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : exam.registration.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.registration.status}
                      </span>
                    </div>
                    {exam.registration.registeredAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Registered on {formatDate(exam.registration.registeredAt)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {exams.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <Calendar className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No exams found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'upcoming' 
              ? "You don't have any upcoming exams."
              : filter === 'ongoing'
              ? "There are no exams currently in progress."
              : "You haven't completed any exams yet."
            }
          </p>
          <button
            onClick={() => router.push('/exams')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Available Exams
          </button>
        </div>
      )}
    </div>
  );
}