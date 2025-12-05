'use client';

import { QuestionPaperFormData } from '@/types/question-paper.type';

interface Props {
  formData: QuestionPaperFormData;
  updateFormData: (field: keyof QuestionPaperFormData, value: any) => void;
  onNext: () => void;
}

export function CreationMethodSelection({ formData, updateFormData, onNext }: Props) {
  const methods = [
    {
      id: 'manual',
      title: 'Manual Creation',
      description: 'Add questions manually one by one or import from file',
      icon: '✍️',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'random',
      title: 'Random Generation',
      description: 'Generate random paper from question bank using filters',
      icon: '🎲',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'mixed',
      title: 'Mixed Method',
      description: 'Combine manual questions with random generation',
      icon: '🔄',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'template',
      title: 'Use Template',
      description: 'Create from existing template or previous paper',
      icon: '📋',
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  const handleNext = () => {
    if (formData.creationMethod) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Creation Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {methods.map((method) => (
          <button
            key={method.id}
            className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
              formData.creationMethod === method.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : method.color
            }`}
            onClick={() => updateFormData('creationMethod', method.id)}
          >
            <div className="text-3xl mb-3">{method.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{method.title}</h3>
            <p className="text-gray-600 text-sm">{method.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <div></div>
        <button
          onClick={handleNext}
          disabled={!formData.creationMethod}
          className={`px-6 py-3 rounded-lg font-medium ${
            formData.creationMethod
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Basic Information →
        </button>
      </div>
    </div>
  );
}