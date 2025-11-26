'use client'
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, FileText, TrendingUp, Award, Settings, Plus, Search, Filter, Download, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Target } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock data
  const stats = {
    totalUsers: 12450,
    activeUsers: 8932,
    premiumUsers: 2341,
    totalQuestions: 15680,
    totalExams: 342,
    todayAttempts: 1243,
    avgScore: 67.5,
    revenue: 456780
  };

  const subjectData = [
    { name: 'Bangla', questions: 2340, attempts: 8934, avgScore: 72 },
    { name: 'English', questions: 2120, attempts: 8123, avgScore: 65 },
    { name: 'Math', questions: 1890, attempts: 7234, avgScore: 58 },
    { name: 'GK', questions: 3240, attempts: 9876, avgScore: 71 },
    { name: 'Science', questions: 1567, attempts: 6543, avgScore: 63 },
    { name: 'ICT', questions: 1234, attempts: 5432, avgScore: 69 }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 3200, premium: 450 },
    { month: 'Feb', users: 4100, premium: 620 },
    { month: 'Mar', users: 5300, premium: 890 },
    { month: 'Apr', users: 6800, premium: 1240 },
    { month: 'May', users: 8900, premium: 1680 },
    { month: 'Jun', users: 12450, premium: 2341 }
  ];

  const examPerformanceData = [
    { bcs: '35th', attempts: 2340, avgScore: 68 },
    { bcs: '36th', attempts: 2890, avgScore: 71 },
    { bcs: '37th', attempts: 3120, avgScore: 69 },
    { bcs: '38th', attempts: 3456, avgScore: 72 },
    { bcs: '39th', attempts: 2987, avgScore: 70 },
    { bcs: '40th', attempts: 3234, avgScore: 73 }
  ];

  const difficultyDistribution = [
    { name: 'Easy', value: 4234, color: '#10b981' },
    { name: 'Medium', value: 8456, color: '#f59e0b' },
    { name: 'Hard', value: 2990, color: '#ef4444' }
  ];

  const recentUsers = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@email.com', role: 'STUDENT', premium: true, joined: '2 hours ago' },
    { id: 2, name: 'Fatima Khan', email: 'fatima@email.com', role: 'STUDENT', premium: false, joined: '4 hours ago' },
    { id: 3, name: 'Rafiq Islam', email: 'rafiq@email.com', role: 'STUDENT', premium: true, joined: '6 hours ago' },
    { id: 4, name: 'Nusrat Jahan', email: 'nusrat@email.com', role: 'STUDENT', premium: false, joined: '8 hours ago' }
  ];

  const recentQuestions = [
    { id: 1, text: 'বাংলাদেশের সংবিধান কত সালে প্রণীত হয়?', subject: 'Bangla', bcs: '40th', status: 'active' },
    { id: 2, text: 'What is the capital of Australia?', subject: 'English', bcs: '39th', status: 'active' },
    { id: 3, text: 'মুক্তিযুদ্ধের সেক্টর কমান্ডার কতজন ছিলেন?', subject: 'History', bcs: '38th', status: 'pending' },
    { id: 4, text: 'সমকোণী ত্রিভুজের বৈশিষ্ট্য কি?', subject: 'Math', bcs: '37th', status: 'active' }
  ];

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} change={12.5} color="bg-blue-500" />
        <StatCard icon={Award} label="Premium Users" value={stats.premiumUsers} change={8.3} color="bg-purple-500" />
        <StatCard icon={BookOpen} label="Total Questions" value={stats.totalQuestions} change={15.2} color="bg-green-500" />
        <StatCard icon={FileText} label="Total Exams" value={stats.totalExams} change={6.7} color="bg-orange-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
              <Line type="monotone" dataKey="premium" stroke="#8b5cf6" strokeWidth={2} name="Premium Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Question Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(10 * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="questions" fill="#3b82f6" name="Questions" />
            <Bar dataKey="attempts" fill="#10b981" name="Attempts" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BCS Exam Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">BCS Exam Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={examPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bcs" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgScore" stroke="#f59e0b" strokeWidth={2} name="Avg Score %" />
            <Line type="monotone" dataKey="attempts" stroke="#8b5cf6" strokeWidth={2} name="Attempts" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.premium ? (
                      <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">Premium</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const QuestionsTab = () => (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="bangla">Bangla</option>
              <option value="english">English</option>
              <option value="math">Math</option>
              <option value="gk">General Knowledge</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus size={20} />
            Add Question
          </button>
        </div>
      </div>

      {/* Subject Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjectData.map((subject) => (
          <div key={subject.name} className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{subject.name}</h4>
            <p className="text-2xl font-bold text-gray-800">{subject.questions}</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {subject.avgScore}%</p>
          </div>
        ))}
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BCS Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">{question.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {question.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.bcs}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {question.status === 'active' ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-xs font-semibold">Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Clock size={16} />
                        <span className="text-xs font-semibold">Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ExamsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Exams</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus size={20} />
            Create Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'BCS 40th Full Model Test', questions: 200, duration: 120, attempts: 1234, active: true },
          { title: 'Bangla Literature Practice', questions: 50, duration: 30, attempts: 876, active: true },
          { title: 'Math Quick Test', questions: 30, duration: 20, attempts: 654, active: true },
          { title: 'English Grammar Test', questions: 40, duration: 25, attempts: 543, active: false },
        ].map((exam, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-800">{exam.title}</h3>
              {exam.active ? (
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">Inactive</span>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{exam.questions} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{exam.duration} Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{exam.attempts} Attempts</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">BCS Prep Pro</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  SA
                </div>
                <div>
                  <p className="text-sm font-medium">Super Admin</p>
                  <p className="text-xs text-gray-500">admin@bcsprepro.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b px-6 sticky top-[73px] z-10">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'questions', label: 'Questions', icon: BookOpen },
            { id: 'exams', label: 'Exams', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'questions' && <QuestionsTab />}
        {activeTab === 'exams' && <ExamsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;