// types/category.types.ts
export interface ExamType {
  id: string;
  name: string;
  shortCode?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ExamSeries {
  id: string;
  name: string;
  fullName?: string;
  year?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  examTypeId: string;
  examType?: ExamType;
}

export interface QuestionBankSubject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  subjectId: string;
  subject?: QuestionBankSubject;
}

export interface Standard {
  id: string;
  name: string;
  level?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryFormData {
  // Exam Type
  examTypeName: string;
  examTypeShortCode: string;
  examTypeDescription: string;
  
  // Exam Series
  examSeriesName: string;
  examSeriesFullName: string;
  examSeriesYear: number;
  examSeriesDescription: string;
  examSeriesExamTypeId: string;
  
  // Subject
  subjectName: string;
  subjectCode: string;
  subjectDescription: string;
  
  // Topic
  topicName: string;
  topicDescription: string;
  topicSubjectId: string;
  
  // Standard
  standardName: string;
  standardLevel: number;
  standardDescription: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}