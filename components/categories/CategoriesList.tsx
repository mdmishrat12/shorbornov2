// components/categories/CategoriesList.tsx
import { ExamType, ExamSeries, QuestionBankSubject, Topic, Standard } from '@/types/category.types';

interface CategoriesListProps {
  activeTab: string;
  examTypes: ExamType[];
  examSeries: ExamSeries[];
  subjects: QuestionBankSubject[];
  topics: Topic[];
  standards: Standard[];
  onRefresh: () => void;
}

export function CategoriesList({ 
  activeTab, 
  examTypes = [], 
  examSeries = [], 
  subjects = [], 
  topics = [], 
  standards = [], 
  onRefresh 
}: CategoriesListProps) {
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'exam-types':
        return examTypes || [];
      case 'exam-series':
        return examSeries || [];
      case 'subjects':
        return subjects || [];
      case 'topics':
        return topics || [];
      case 'standards':
        return standards || [];
      default:
        return [];
    }
  };

  const getItemCount = () => {
    const items = getCurrentItems();
    return items?.length || 0;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const items = getCurrentItems();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {activeTab === 'exam-types' && 'Exam Types'}
          {activeTab === 'exam-series' && 'Exam Series'}
          {activeTab === 'subjects' && 'Subjects'}
          {activeTab === 'topics' && 'Topics'}
          {activeTab === 'standards' && 'Standards'}
        </h3>
        <button
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold">{getItemCount()}</span> items
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {!items || items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No items found</p>
            <p className="text-sm">Create your first item using the form</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item?.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              {/* Exam Type */}
              {item && 'shortCode' in item && (
                <div>
                  <h4 className="font-medium text-gray-800">
                    {item.name} {item.shortCode && `(${item.shortCode})`}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              )}

              {/* Exam Series */}
              {item && 'examType' in item && (
                <div>
                  <h4 className="font-medium text-gray-800">
                    {item.fullName || `${item.examType?.name || ''} ${item.name}`}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span>{item.examType?.name || 'Unknown Exam Type'}</span>
                    {item.year && <span>• {item.year}</span>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              )}

              {/* Subject */}
              {item && 'code' in item && !('subjectId' in item) && (
                <div>
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    {item.code && <span>Code: {item.code}</span>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              )}

              {/* Topic */}
              {item && 'subjectId' in item && (
                <div>
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Subject: {item.subject?.name || 'Unknown Subject'}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              )}

              {/* Standard */}
              {item && 'level' in item && !('subjectId' in item) && (
                <div>
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    {item.level && <span>Level: {item.level}</span>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>Created: {formatDate(item?.createdAt || '')}</span>
                <span className={`px-2 py-1 rounded-full ${
                  item?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}