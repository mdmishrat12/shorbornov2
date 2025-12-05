// components/exams/ExamInstructions.tsx
'use client';

interface ExamInstructionsProps {
  exam: any;
  attempt: any;
  onStart: () => void;
}

export function ExamInstructions({ exam, attempt, onStart }: ExamInstructionsProps) {
  const rules = [
    'You must complete the exam within the allotted time.',
    'Do not refresh the page or navigate away during the exam.',
    'All answers are auto-saved every 30 seconds.',
    'The exam will auto-submit when time expires.',
    exam.allowTabSwitch ? null : 'Switching tabs/windows may result in disqualification.',
    exam.enableProctoring ? 'This exam is proctored. Webcam and microphone are required.' : null,
    exam.allowNegativeMarking ? 'Negative marking is applied for wrong answers.' : null,
    'Use the "Flag" button to mark questions for review.',
    'You can navigate between questions using the sidebar.',
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{exam.title}</h1>
            <p className="text-gray-600">Exam Instructions & Guidelines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Exam Details */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Exam Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{exam.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{attempt.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks:</span>
                  <span className="font-medium">{attempt.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="font-medium">{exam.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam Window:</span>
                  <span className="font-medium text-right">
                    {new Date(exam.scheduledStart).toLocaleString()} to<br />
                    {new Date(exam.scheduledEnd).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Rules */}
            <div className="bg-red-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Important Rules</h2>
              <ul className="space-y-2">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* System Requirements */}
          {exam.enableProctoring && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">System Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    exam.requireWebcam ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {exam.requireWebcam ? '✓' : '○'}
                  </div>
                  <span>Webcam {exam.requireWebcam ? 'Required' : 'Optional'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    exam.requireMicrophone ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {exam.requireMicrophone ? '✓' : '○'}
                  </div>
                  <span>Microphone {exam.requireMicrophone ? 'Required' : 'Optional'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Grading Information */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Grading Information</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                • Each correct answer: <span className="font-medium">+{exam.marksPerQuestion || 1} mark</span>
              </p>
              {exam.allowNegativeMarking && (
                <p className="text-gray-700">
                  • Each wrong answer: <span className="font-medium">-{exam.negativeMarkingPerQuestion || 0.25} mark</span>
                </p>
              )}
              <p className="text-gray-700">
                • Skipped questions: <span className="font-medium">0 marks</span>
              </p>
              <p className="text-gray-700">
                • Passing requirement: <span className="font-medium">{exam.passingScore}% or higher</span>
              </p>
            </div>
          </div>

          {/* Agreement */}
          <div className="mb-8">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-3"
                required
              />
              <span className="text-gray-700">
                I have read and understood all the instructions. I agree to follow all exam rules
                and understand that any violation may result in disqualification.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Go Back
            </button>
            <button
              onClick={onStart}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Start Exam →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}