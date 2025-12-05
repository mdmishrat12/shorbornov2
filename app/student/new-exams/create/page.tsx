'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Calendar, Clock, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface QuestionPaper {
  id: string;
  title: string;
  description?: string;
  totalMarks: number;
  duration: number;
  totalQuestions: number;
}

export default function CreateExamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questionPaperId: '',
    scheduledStart: '',
    scheduledEnd: '',
    duration: 30,
    bufferTime: 15,
    accessType: 'public',
    password: '',
    maxAttempts: 1,
    retakeDelay: 0,
    enableProctoring: false,
    requireWebcam: false,
    requireMicrophone: false,
    allowTabSwitch: false,
    maxTabSwitches: 0,
    showQuestionNumbers: true,
    showTimer: true,
    showRemainingQuestions: true,
    allowQuestionNavigation: true,
    allowQuestionReview: true,
    allowAnswerChange: true,
    showResultImmediately: false,
    showAnswersAfterExam: false,
    showLeaderboard: true,
    resultReleaseTime: '',
    passingScore: 40,
    gradingMethod: 'auto',
    allowNegativeMarking: false,
    negativeMarkingPerQuestion: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    fetchQuestionPapers();
  }, [status, router]);

  const fetchQuestionPapers = async () => {
    try {
      const response = await fetch('/api/question-papers');
      const data = await response.json();
      if (data.success) {
        setQuestionPapers(data.data);
      }
    } catch (error) {
      console.error('Error fetching question papers:', error);
    }
  };
  console.log('question papers',questionPapers)



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.questionPaperId) {
      alert('Please select a question paper');
      return;
    }

    if (!formData.scheduledStart || !formData.scheduledEnd) {
      alert('Start and end times are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Exam created successfully!');
        router.push('/exams');
      } else {
        alert(data.message || 'Failed to create exam');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="mt-2 text-gray-600">
            Configure your exam settings and schedule
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the basic details of your exam
            </p>
            
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Exam Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Mid-term Mathematics Exam"
                />
              </div>

              <div>
                <label htmlFor="questionPaperId" className="block text-sm font-medium text-gray-700">
                  Question Paper *
                </label>
                <select
                  id="questionPaperId"
                  name="questionPaperId"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.questionPaperId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a question paper</option>
                  {questionPapers.map((paper) => (
                    <option key={paper.id} value={paper.id}>
                      {paper.title} ({paper.totalQuestions} questions, {paper.totalMarks} marks)
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the purpose, topics covered, and any important instructions..."
                />
              </div>
            </div>
          </div>

          {/* Schedule & Duration */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900">Schedule & Duration</h2>
            <p className="mt-1 text-sm text-gray-500">
              Set when the exam will be available and how long it will last
            </p>
            
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
              <div>
                <label htmlFor="scheduledStart" className="block text-sm font-medium text-gray-700">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="scheduledStart"
                  name="scheduledStart"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.scheduledStart}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="scheduledEnd" className="block text-sm font-medium text-gray-700">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="scheduledEnd"
                  name="scheduledEnd"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.scheduledEnd}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700">
                  Buffer Time (minutes)
                </label>
                <input
                  type="number"
                  id="bufferTime"
                  name="bufferTime"
                  min="0"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.bufferTime}
                  onChange={handleInputChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Extra time allowed for technical issues
                </p>
              </div>

              <div>
                <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
                  Max Attempts
                </label>
                <input
                  type="number"
                  id="maxAttempts"
                  name="maxAttempts"
                  min="1"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="retakeDelay" className="block text-sm font-medium text-gray-700">
                  Retake Delay (hours)
                </label>
                <input
                  type="number"
                  id="retakeDelay"
                  name="retakeDelay"
                  min="0"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.retakeDelay}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Access & Security */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900">Access & Security</h2>
            <p className="mt-1 text-sm text-gray-500">
              Control who can access the exam and security settings
            </p>
            
            <div className="space-y-6 mt-6">
              <div>
                <label htmlFor="accessType" className="block text-sm font-medium text-gray-700">
                  Access Type
                </label>
                <select
                  id="accessType"
                  name="accessType"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.accessType}
                  onChange={handleInputChange}
                >
                  <option value="public">Public - Anyone can register</option>
                  <option value="private">Private - Password required</option>
                  <option value="invite">Invite Only - Manual approval</option>
                </select>
              </div>

              {formData.accessType === 'private' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableProctoring"
                    name="enableProctoring"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.enableProctoring}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="enableProctoring" className="block ml-2 text-sm text-gray-700">
                    Enable Proctoring
                  </label>
                </div>

                {formData.enableProctoring && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireWebcam"
                        name="requireWebcam"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.requireWebcam}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="requireWebcam" className="block ml-2 text-sm text-gray-700">
                        Require Webcam
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireMicrophone"
                        name="requireMicrophone"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.requireMicrophone}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="requireMicrophone" className="block ml-2 text-sm text-gray-700">
                        Require Microphone
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowTabSwitch"
                        name="allowTabSwitch"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.allowTabSwitch}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="allowTabSwitch" className="block ml-2 text-sm text-gray-700">
                        Allow Tab Switching
                      </label>
                    </div>
                    {!formData.allowTabSwitch && (
                      <div>
                        <label htmlFor="maxTabSwitches" className="block text-sm font-medium text-gray-700">
                          Max Tab Switches Allowed
                        </label>
                        <input
                          type="number"
                          id="maxTabSwitches"
                          name="maxTabSwitches"
                          min="0"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.maxTabSwitches}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Exam Settings */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900">Exam Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure the exam experience
            </p>
            
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showQuestionNumbers"
                    name="showQuestionNumbers"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showQuestionNumbers}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showQuestionNumbers" className="block ml-2 text-sm text-gray-700">
                    Show Question Numbers
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showTimer"
                    name="showTimer"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showTimer}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showTimer" className="block ml-2 text-sm text-gray-700">
                    Show Timer
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showRemainingQuestions"
                    name="showRemainingQuestions"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showRemainingQuestions}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showRemainingQuestions" className="block ml-2 text-sm text-gray-700">
                    Show Remaining Questions
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowQuestionNavigation"
                    name="allowQuestionNavigation"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.allowQuestionNavigation}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allowQuestionNavigation" className="block ml-2 text-sm text-gray-700">
                    Allow Question Navigation
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowQuestionReview"
                    name="allowQuestionReview"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.allowQuestionReview}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allowQuestionReview" className="block ml-2 text-sm text-gray-700">
                    Allow Question Review
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowAnswerChange"
                    name="allowAnswerChange"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.allowAnswerChange}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allowAnswerChange" className="block ml-2 text-sm text-gray-700">
                    Allow Answer Change
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showResultImmediately"
                    name="showResultImmediately"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showResultImmediately}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showResultImmediately" className="block ml-2 text-sm text-gray-700">
                    Show Result Immediately
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showAnswersAfterExam"
                    name="showAnswersAfterExam"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showAnswersAfterExam}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showAnswersAfterExam" className="block ml-2 text-sm text-gray-700">
                    Show Answers After Exam
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showLeaderboard"
                    name="showLeaderboard"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.showLeaderboard}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showLeaderboard" className="block ml-2 text-sm text-gray-700">
                    Show Leaderboard
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowNegativeMarking"
                    name="allowNegativeMarking"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.allowNegativeMarking}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allowNegativeMarking" className="block ml-2 text-sm text-gray-700">
                    Allow Negative Marking
                  </label>
                </div>
              </div>

              {formData.allowNegativeMarking && (
                <div>
                  <label htmlFor="negativeMarkingPerQuestion" className="block text-sm font-medium text-gray-700">
                    Negative Mark per Incorrect Answer
                  </label>
                  <input
                    type="number"
                    id="negativeMarkingPerQuestion"
                    name="negativeMarkingPerQuestion"
                    step="0.01"
                    min="0"
                    max="1"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.negativeMarkingPerQuestion}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  id="passingScore"
                  name="passingScore"
                  min="0"
                  max="100"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="gradingMethod" className="block text-sm font-medium text-gray-700">
                  Grading Method
                </label>
                <select
                  id="gradingMethod"
                  name="gradingMethod"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.gradingMethod}
                  onChange={handleInputChange}
                >
                  <option value="auto">Automatic</option>
                  <option value="manual">Manual Review</option>
                  <option value="mixed">Automatic with Manual Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end gap-3">
            <Link
              href="/exams"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Exam
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}