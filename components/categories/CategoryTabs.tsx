// components/categories/CategoryTabs.tsx
interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const tabs = [
  { id: 'exam-types', name: 'Exam Types', icon: '📝' },
  { id: 'exam-series', name: 'Exam Series', icon: '🔢' },
  { id: 'subjects', name: 'Subjects', icon: '📚' },
  { id: 'topics', name: 'Topics', icon: '🏷️' },
  { id: 'standards', name: 'Standards', icon: '🎯' },
];

export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}