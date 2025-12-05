// components/question-papers/SuccessModal.tsx
'use client';

import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: { success: boolean; message: string; data?: any } | null;
}

export function SuccessModal({ isOpen, onClose, result }: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
            result?.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result?.success ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Message */}
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {result?.success ? 'Paper Created Successfully!' : 'Creation Failed'}
          </h3>
          <p className="text-gray-600 mb-6">
            {result?.message || 'Something went wrong. Please try again.'}
          </p>

          {/* Paper Details */}
          {result?.success && result.data && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paper ID:</span>
                  <span className="font-mono text-sm">{result.data.id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{result.data.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {result?.success ? (
              <>
                <button
                  onClick={() => router.push(`/question-papers/${result.data?.id}/edit`)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue Editing
                </button>
                <button
                  onClick={() => router.push('/question-papers')}
                  className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  View All Papers
                </button>
                <button
                  onClick={() => {
                    // Create exam from this paper
                    router.push(`/exams/create?paperId=${result.data?.id}`);
                  }}
                  className="w-full py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                >
                  Create Exam from This Paper
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                router.push('/question-papers/create');
              }}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Create Another Paper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}