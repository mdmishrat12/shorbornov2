// types/question.types.ts
export interface ExamType {
  id: string;
  name: string;
  shortCode?: string;
  description?: string;
}

export interface ExamSeries {
  id: string;
  name: string;
  fullName?: string;
  year?: number;
  examType: ExamType;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
}

export interface Standard {
  id: string;
  name: string;
  level?: number;
}

export interface QuestionFormData {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  
  // Categories
  subjectId: string;
  examTypeId: string;
  examSeriesId: string;
  topicId: string;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'analytical';
  standardId: string;
  
  // Metadata
  questionNumber?: number;
  marks: number;
  timeLimit: number;
  hasImage: boolean;
  imageUrl: string;
}

export interface CategoryData {
  examTypes: ExamType[];
  examSeries: ExamSeries[];
  subjects: Subject[];
  topics: Topic[];
  standards: Standard[];
}