// components/study/StudyStats.tsx
interface StudyStatsProps {
  totalQuestions: number;
  filteredQuestions: number;
  showAnswers: Record<string, boolean>;
  onToggleAll: () => void;
}

export function StudyStats({ totalQuestions, filteredQuestions, showAnswers, onToggleAll }: StudyStatsProps) {
  const shownAnswersCount = Object.keys(showAnswers).length;
  const allAnswersShown = shownAnswersCount === filteredQuestions && filteredQuestions > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
          <div className="text-sm text-gray-600 mt-1">Total Questions</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{filteredQuestions}</div>
          <div className="text-sm text-gray-600 mt-1">Filtered Questions</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{shownAnswersCount}</div>
          <div className="text-sm text-gray-600 mt-1">Answers Revealed</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <button
            onClick={onToggleAll}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              allAnswersShown
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {allAnswersShown ? 'Hide All Answers' : 'Show All Answers'}
          </button>
        </div>
      </div>
    </div>
  );
}