'use client';

import { Calendar, Clock, Users, BarChart3, Play, FileText } from 'lucide-react';
import Link from 'next/link';

interface ExamCardProps {
  exam: {
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
    accessType: string;
  };
}

export default function ExamCard({ exam }: ExamCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const isExamOpen = () => {
    const now = new Date();
    const start = new Date(exam.scheduledStart);
    const end = new Date(exam.scheduledEnd);
    return now >= start && now <= end && exam.status === 'live';
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
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
          <span className="text-sm font-medium text-gray-900">{exam.code}</span>
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

        {exam.averageScore > 0 && (
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <BarChart3 className="flex-shrink-0 w-4 h-4 mr-2" />
            <span>Average Score: {exam.averageScore}%</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            {exam.accessType === 'private' && (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                Private
              </span>
            )}
            {isExamOpen() && (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Open
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isExamOpen() ? (
              <>
                <Link
                  href={`/exams/${exam.id}/register`}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register
                </Link>
                <Link
                  href={`/exams/${exam.id}`}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Details
                </Link>
              </>
            ) : (
              <Link
                href={`/exams/${exam.id}`}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}