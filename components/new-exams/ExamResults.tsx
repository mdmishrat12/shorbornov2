// components/exam/ExamResults.tsx
'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface ExamResultsProps {
  attempt: {
    id: string;
    finalScore: number;
    percentage: number;
    rank?: number;
    percentile?: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    totalQuestions: number;
    timeSpent: number;
    result: string;
    obtainedMarks: number;
    totalMarks: number;
  };
  exam: {
    title: string;
    passingScore: number;
    showLeaderboard: boolean;
  };
  questions?: Array<{
    id: string;
    questionNumber: number;
    question: string;
    options: Array<{ option: string; text: string }>;
    correctAnswer?: string;
    userAnswer?: {
      selectedOption: string;
      isCorrect?: boolean;
    };
    explanation?: string;
  }>;
}

export default function ExamResults({ attempt, exam, questions }: ExamResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'answers' | 'analysis'>('summary');
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const accuracy = attempt.correctAnswers > 0 
    ? Math.round((attempt.correctAnswers / (attempt.correctAnswers + attempt.incorrectAnswers)) * 100)
    : 0;

  const isPassed = attempt.finalScore >= exam.passingScore;

  const StatsCard = ({ 
    icon: Icon, 
    title, 
    value, 
    color 
  }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    color: string;
  }) => (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/50 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );

  const ProgressRing = ({ 
    percentage, 
    label, 
    size = 120 
  }: { 
    percentage: number; 
    label: string; 
    size?: number;
  }) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex flex-col items-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            className="fill-none stroke-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`fill-none transition-all duration-1000 ${
              isPassed ? 'stroke-green-500' : 'stroke-red-500'
            }`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{exam.title} - Results</h1>
            <p className="text-blue-100">Exam completed successfully</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <ProgressRing 
                percentage={attempt.percentage} 
                label="Score" 
              />
              
              <div className="flex-1">
                <div className={`text-4xl font-bold mb-2 ${
                  isPassed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {attempt.finalScore}/{attempt.totalMarks}
                </div>
                <div className="text-lg mb-4">
                  <span className={`px-4 py-1 rounded-full ${
                    isPassed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <p className="text-gray-600">
                  {isPassed 
                    ? `Congratulations! You scored ${attempt.percentage}% and passed the exam.`
                    : `You scored ${attempt.percentage}%, which is below the passing score of ${exam.passingScore}%.`
                  }
                </p>
              </div>

              {attempt.rank && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Rank</div>
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div className="text-3xl font-bold">#{attempt.rank}</div>
                  </div>
                  {attempt.percentile && (
                    <div className="text-sm text-gray-600 mt-1">
                      Top {100 - attempt.percentile}%
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold">{accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Taken</span>
              <span className="font-semibold">{formatTime(attempt.timeSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-semibold text-green-600">
                {attempt.correctAnswers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Incorrect Answers</span>
              <span className="font-semibold text-red-600">
                {attempt.incorrectAnswers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skipped</span>
              <span className="font-semibold text-gray-600">
                {attempt.skippedQuestions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            {['summary', 'answers', 'analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap capitalize
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab === 'summary' && <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Summary</span>}
                {tab === 'answers' && <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Answers</span>}
                {tab === 'analysis' && <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Analysis</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeTab === 'summary' && (
          <div>
            <h3 className="font-semibold text-xl mb-6">Performance Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={Target}
                title="Score"
                value={`${attempt.finalScore}/${attempt.totalMarks}`}
                color="bg-green-50 border-green-200"
              />
              <StatsCard
                icon={Award}
                title="Accuracy"
                value={`${accuracy}%`}
                color="bg-blue-50 border-blue-200"
              />
              <StatsCard
                icon={Clock}
                title="Time"
                value={formatTime(attempt.timeSpent)}
                color="bg-purple-50 border-purple-200"
              />
              <StatsCard
                icon={Trophy}
                title="Rank"
                value={attempt.rank ? `#${attempt.rank}` : 'N/A'}
                color="bg-yellow-50 border-yellow-200"
              />
            </div>

            {/* Score Distribution */}
            <div className="mb-8">
              <h4 className="font-semibold mb-4">Score Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Passing Score</span>
                  <span className="font-semibold">{exam.passingScore} marks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full bg-green-500 transition-all duration-1000"
                    style={{ 
                      width: `${(attempt.finalScore / attempt.totalMarks) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span className="relative" style={{ left: `${(exam.passingScore / attempt.totalMarks) * 100}%` }}>
                    Pass Mark
                  </span>
                  <span>{attempt.totalMarks}</span>
                </div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Question Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {attempt.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {attempt.incorrectAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {attempt.skippedQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'answers' && questions && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl">Question-wise Answers</h3>
              <button
                onClick={() => setShowAllAnswers(!showAllAnswers)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4" />
                {showAllAnswers ? 'Show Only Incorrect' : 'Show All Answers'}
              </button>
            </div>

            <div className="space-y-6">
              {questions
                .filter(q => showAllAnswers || !q.userAnswer?.isCorrect)
                .map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          Q{question.questionNumber}
                        </span>
                        {question.userAnswer && (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            question.userAnswer.isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {question.userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">1 mark</span>
                    </div>

                    <p className="font-medium mb-4">{question.question}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {question.options.map((option) => {
                        const isSelected = question.userAnswer?.selectedOption === option.option;
                        const isCorrect = question.correctAnswer === option.option;
                        
                        return (
                          <div
                            key={option.option}
                            className={`
                              p-3 rounded-lg border
                              ${isCorrect 
                                ? 'bg-green-50 border-green-200' 
                                : isSelected
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-gray-50 border-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center
                                ${isCorrect 
                                  ? 'bg-green-500 text-white' 
                                  : isSelected
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }
                              `}>
                                {option.option}
                              </div>
                              <span>{option.text}</span>
                              {isCorrect && (
                                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                              )}
                              {isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-1">Explanation</h5>
                        <p className="text-sm text-gray-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <h3 className="font-semibold text-xl mb-6">Performance Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Time Analysis */}
              <div>
                <h4 className="font-semibold mb-4">Time Management</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Average time per question</span>
                      <span className="text-sm font-semibold">
                        {formatTime(Math.round(attempt.timeSpent / attempt.totalQuestions))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>You spent an average of {Math.round(attempt.timeSpent / attempt.totalQuestions)} seconds per question.</p>
                    {attempt.timeSpent < (attempt.totalQuestions * 60) && (
                      <p className="text-green-600 mt-1">
                        Good time management! You completed within the allocated time.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Accuracy Analysis */}
              <div>
                <h4 className="font-semibold mb-4">Accuracy Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overall Accuracy</span>
                      <span className="text-sm font-semibold">{accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {accuracy >= 80 ? (
                      <p className="text-green-600">Excellent accuracy! Keep up the good work.</p>
                    ) : accuracy >= 60 ? (
                      <p className="text-yellow-600">Good accuracy, but there's room for improvement.</p>
                    ) : (
                      <p className="text-red-600">Focus on improving your accuracy by reviewing concepts.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-800">Recommendations</h4>
              <ul className="space-y-2 text-blue-700">
                {isPassed ? (
                  <>
                    <li>• Review the questions you answered incorrectly</li>
                    <li>• Practice more questions on weak topics</li>
                    <li>• Consider taking more challenging exams</li>
                  </>
                ) : (
                  <>
                    <li>• Focus on fundamental concepts</li>
                    <li>• Take practice tests before the next attempt</li>
                    <li>• Review the detailed answer explanations</li>
                  </>
                )}
                <li>• Take the exam again after {attempt.timeSpent < (attempt.totalQuestions * 60) ? 'focusing on accuracy' : 'improving time management'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retake Exam
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          View Leaderboard
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Download Certificate
        </button>
      </div>
    </div>
  );
}