// components/study/EmptyState.tsx
interface EmptyStateProps {
  onResetFilters: () => void;
  isSearchActive: boolean;
}

export function EmptyState({ onResetFilters, isSearchActive }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No questions found</h3>
        <p className="text-gray-600 mb-6">
          {isSearchActive
            ? 'No questions match your current filters. Try adjusting your search criteria.'
            : 'No questions are available in the database yet. Check back later!'}
        </p>
        {isSearchActive && (
          <button
            onClick={onResetFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}