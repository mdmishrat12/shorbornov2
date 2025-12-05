// components/dashboard/ExamDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Trophy,
  Award,
  Eye,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  accuracy: number;
  rank?: number;
  improvement: number;
  streak: number;
  upcomingExams: number;
  recentAttempts: Array<{
    id: string;
    examTitle: string;
    score: number;
    percentage: number;
    date: string;
    result: string;
  }>;
}

export default function ExamDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?range=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color,
    change
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
    change?: number;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`text-sm font-semibold ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Exam Dashboard</h1>
          <p className="text-gray-600">Track your exam performance and progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded capitalize ${
                  timeRange === range
                    ? 'bg-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={fetchDashboardStats}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completed Exams"
          value={stats.completedExams}
          icon={Award}
          color="bg-blue-500"
          change={5}
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={Target}
          color="bg-green-500"
          change={stats.improvement}
        />
        <StatCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Study Streak"
          value={`${stats.streak} days`}
          icon={Trophy}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Performance Trend</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Performance chart would appear here
          </div>
        </div>

        {/* Recent Attempts */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Recent Attempts</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => router.push(`/exams/results/${attempt.id}`)}
              >
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{attempt.examTitle}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{attempt.date}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      attempt.result === 'pass'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {attempt.result}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{attempt.percentage}%</div>
                  <div className="text-sm text-gray-600">{attempt.score} marks</div>
                </div>
              </div>
            ))}
            
            {stats.recentAttempts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent exam attempts
              </div>
            )}
          </div>

          <button
            onClick={() => router.push('/exams/attempts')}
            className="w-full mt-4 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            View All Attempts
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h2 className="font-semibold text-lg mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/exams/accessible')}
            className="flex flex-col items-center p-4 border rounded-xl hover:bg-gray-50"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <span className="font-medium">Upcoming Exams</span>
            <span className="text-sm text-gray-600">{stats.upcomingExams} exams</span>
          </button>
          <button
            onClick={() => router.push('/exams')}
            className="flex flex-col items-center p-4 border rounded-xl hover:bg-gray-50"
          >
            <Eye className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-medium">Browse Exams</span>
            <span className="text-sm text-gray-600">All available exams</span>
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="flex flex-col items-center p-4 border rounded-xl hover:bg-gray-50"
          >
            <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="font-medium">Leaderboard</span>
            <span className="text-sm text-gray-600">Global ranking</span>
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="flex flex-col items-center p-4 border rounded-xl hover:bg-gray-50"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="font-medium">Analytics</span>
            <span className="text-sm text-gray-600">Detailed insights</span>
          </button>
        </div>
      </div>

      {/* Rank Display */}
      {stats.rank && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl mb-2">Current Rank</h3>
              <p className="text-gray-600 mb-4">
                You're ranked #{stats.rank} among all students
              </p>
              <button
                onClick={() => router.push('/leaderboard')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                View Leaderboard
              </button>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-yellow-600">#{stats.rank}</div>
              <div className="text-sm text-gray-600">Global Ranking</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}