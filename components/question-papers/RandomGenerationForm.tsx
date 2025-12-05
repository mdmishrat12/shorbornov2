// components/question-papers/RandomGenerationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { QuestionPaperFormData } from '@/types/question-paper.type';

interface Category {
  subjects?: any[];
  examTypes?: any[];
  topics?: any[];
  standards?: any[];
}

interface RandomGenerationFormProps {
  formData: QuestionPaperFormData;
  updateFormData: (field: keyof QuestionPaperFormData, value: any) => void;
  categories: Category;
  onGenerate: () => void;
}

export function RandomGenerationForm({
  formData,
  updateFormData,
  categories,
  onGenerate,
}: RandomGenerationFormProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    formData.generationCriteria?.subjectIds || []
  );
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: formData.generationCriteria?.questionsPerDifficulty?.easy || 0,
    medium: formData.generationCriteria?.questionsPerDifficulty?.medium || 0,
    hard: formData.generationCriteria?.questionsPerDifficulty?.hard || 0,
    analytical: formData.generationCriteria?.questionsPerDifficulty?.analytical || 0,
  });

  const totalQuestions = formData.generationCriteria?.totalQuestions || 0;

  useEffect(() => {
    const sum = Object.values(difficultyDistribution).reduce((a, b) => a + b, 0);
    if (sum !== totalQuestions && totalQuestions > 0) {
      // Auto-distribute if not matching
      const autoDist = {
        easy: Math.floor(totalQuestions * 0.25),
        medium: Math.floor(totalQuestions * 0.35),
        hard: Math.floor(totalQuestions * 0.25),
        analytical: Math.floor(totalQuestions * 0.15),
      };
      setDifficultyDistribution(autoDist);
    }
  }, [totalQuestions]);

  const handleDifficultyChange = (level: keyof typeof difficultyDistribution, value: number) => {
    const newDist = { ...difficultyDistribution, [level]: value };
    setDifficultyDistribution(newDist);
    
    updateFormData('generationCriteria', {
      ...formData.generationCriteria,
      questionsPerDifficulty: newDist,
    });
  };

  const handleSubjectToggle = (subjectId: string) => {
    const newSubjects = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter((id) => id !== subjectId)
      : [...selectedSubjects, subjectId];
    
    setSelectedSubjects(newSubjects);
    updateFormData('generationCriteria', {
      ...formData.generationCriteria,
      subjectIds: newSubjects,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Random Generation Criteria</h3>

      {/* Total Questions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Questions
        </label>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={totalQuestions}
          onChange={(e) =>
            updateFormData('generationCriteria', {
              ...formData.generationCriteria,
              totalQuestions: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">10</span>
          <span className="text-lg font-bold text-blue-600">{totalQuestions} Questions</span>
          <span className="text-sm text-gray-600">200</span>
        </div>
      </div>

      {/* Subject Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Subjects
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.subjects?.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => handleSubjectToggle(subject.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedSubjects.includes(subject.id)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{subject.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {subject.questionCount || 0} questions
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Difficulty Distribution
        </label>
        <div className="space-y-3">
          {[
            { level: 'easy', label: 'Easy', color: 'bg-green-500' },
            { level: 'medium', label: 'Medium', color: 'bg-yellow-500' },
            { level: 'hard', label: 'Hard', color: 'bg-orange-500' },
            { level: 'analytical', label: 'Analytical', color: 'bg-red-500' },
          ].map(({ level, label, color }) => (
            <div key={level}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{label}</span>
                <span className="text-gray-600">
                  {difficultyDistribution[level as keyof typeof difficultyDistribution]} questions
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max={totalQuestions}
                  value={difficultyDistribution[level as keyof typeof difficultyDistribution]}
                  onChange={(e) =>
                    handleDifficultyChange(
                      level as keyof typeof difficultyDistribution,
                      parseInt(e.target.value)
                    )
                  }
                  className={`flex-1 h-2 ${color} rounded-lg appearance-none cursor-pointer`}
                />
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={difficultyDistribution[level as keyof typeof difficultyDistribution]}
                  onChange={(e) =>
                    handleDifficultyChange(
                      level as keyof typeof difficultyDistribution,
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-medium">
            <span>Total Questions:</span>
            <span className="text-blue-600">
              {Object.values(difficultyDistribution).reduce((a, b) => a + b, 0)} / {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks per Question
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.generationCriteria?.marksPerQuestion || 1}
            onChange={(e) =>
              updateFormData('generationCriteria', {
                ...formData.generationCriteria,
                marksPerQuestion: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time per Question (seconds)
          </label>
          <input
            type="number"
            min="30"
            max="300"
            step="30"
            value={formData.generationCriteria?.timePerQuestion || 60}
            onChange={(e) =>
              updateFormData('generationCriteria', {
                ...formData.generationCriteria,
                timePerQuestion: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Advanced Options</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.generationCriteria?.includeExplanation || false}
              onChange={(e) =>
                updateFormData('generationCriteria', {
                  ...formData.generationCriteria,
                  includeExplanation: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Include questions with explanations only
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.generationCriteria?.shuffleQuestions || true}
              onChange={(e) =>
                updateFormData('generationCriteria', {
                  ...formData.generationCriteria,
                  shuffleQuestions: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Shuffle questions after generation
            </span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={selectedSubjects.length === 0 || totalQuestions === 0}
          className={`w-full py-3 rounded-lg font-medium ${
            selectedSubjects.length === 0 || totalQuestions === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Generate Questions from Bank
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          This will select random questions from your question bank based on the criteria above
        </p>
      </div>
    </div>
  );
}