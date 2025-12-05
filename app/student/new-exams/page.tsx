'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Search,
  Filter,
  Plus,
  Play,
  FileText,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  totalRegistered: number;
  totalAttempted: number;
  averageScore: number;
  createdBy: string;
  accessType: string;
  password?: string;
}

export default function ExamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'created' | 'participating' | 'all'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    let filtered = exams;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        exam =>
          exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      // For now, we'll filter by access type
      // In a real app, you'd query for exams created by user or where user is registered
      if (typeFilter === 'created') {
        filtered = filtered.filter(exam => exam.createdBy === session?.user?.id);
      }
    }

    setFilteredExams(filtered);
  }, [exams, searchTerm, statusFilter, typeFilter, session]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exams');
      const data = await response.json();
      if (data.success) {
        setExams(data.data);
        setFilteredExams(data.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'live':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
              <p className="mt-2 text-gray-600">
                Manage and participate in exams
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link
                href="/exams/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Exam
              </Link>
              <Link
                href="/question-papers"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="w-5 h-5 mr-2" />
                Question Papers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exams by title, code, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="created">Created by me</option>
                <option value="participating">Participating</option>
              </select>
              <button
                onClick={fetchExams}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Exams</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Registered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.reduce((sum, exam) => sum + (exam.totalRegistered || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-purple-600 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Attempted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.reduce((sum, exam) => sum + (exam.totalAttempted || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-orange-600 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.length > 0
                    ? Math.round(
                        exams.reduce((sum, exam) => sum + (exam.averageScore || 0), 0) /
                          exams.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <FileText className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams</h3>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? 'Loading exams...' : 'Get started by creating a new exam.'}
            </p>
            <div className="mt-6">
              <Link
                href="/exams/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Exam
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="overflow-hidden bg-white rounded-lg shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          exam.status
                        )}`}
                      >
                        {getStatusIcon(exam.status)}
                        <span className="ml-1">{exam.status.replace('_', ' ')}</span>
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900">
                        {exam.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {exam.description || 'No description'}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {exam.code}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 w-4 h-4 mr-2" />
                      <span>{formatDate(exam.scheduledStart)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 w-4 h-4 mr-2" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="flex-shrink-0 w-4 h-4 mr-2" />
                      <span>
                        {exam.totalRegistered} registered • {exam.totalAttempted} attempted
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div>
                      {exam.averageScore > 0 && (
                        <div className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Avg: {exam.averageScore}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {exam.status === 'scheduled' || exam.status === 'live' ? (
                        <>
                          <Link
                            href={`/student/new-exams/${exam.id}/register`}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Register
                          </Link>
                          {exam.accessType === 'private' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                              Private
                            </span>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/student/new-exams/${exam.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}