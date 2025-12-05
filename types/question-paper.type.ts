// types/question-paper.type.ts
export type QuestionPaperStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
export type CreationMethod = 'manual' | 'random' | 'mixed' | 'template';
export type ResultReleaseType = 'instant' | 'scheduled' | 'manual';

export interface QuestionPaperFormData {
  // Basic Info
  title: string;
  description?: string;
  code?: string;
  
  // Creation Method
  creationMethod: CreationMethod;
  sourceType: 'bank' | 'manual' | 'mixed';
  
  // Random Generation Criteria
  generationCriteria?: {
    subjectIds: string[];
    examTypeIds?: string[];
    examSeriesIds?: string[];
    topicIds?: string[];
    difficultyLevels: ('easy' | 'medium' | 'hard' | 'analytical')[];
    standardIds?: string[];
    totalQuestions: number;
    questionsPerDifficulty?: {
      easy?: number;
      medium?: number;
      hard?: number;
      analytical?: number;
    };
    marksPerQuestion: number;
    timePerQuestion?: number;
    includeExplanation: boolean;
    shuffleQuestions: boolean;
  };
  
  // Manual Questions
  manualQuestions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'analytical';
    marks: number;
  }>;
  
  // Sections (for structured papers)
  sections?: Array<{
    id: string;
    title: string;
    description?: string;
    instructions?: string;
    subjectId?: string;
    questionType?: string;
    totalQuestions: number;
    marksPerQuestion: number;
    negativeMarking?: number;
    timeLimit?: number;
  }>;
  
  // Exam Settings
  examId?: string;
  duration: number;
  totalMarks: number;
  passingScore: number;
  
  // Display & Behavior
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanation: boolean;
  allowReview: boolean;
  
  // Negative Marking
  negativeMarking: {
    enabled: boolean;
    perIncorrect: number;
  };
  
  // Result
  resultRelease: ResultReleaseType;
  resultReleaseAt?: string;
  
  // Metadata
  tags?: string[];
  isTemplate?: boolean;
  templateId?: string;
}

export interface QuestionPaperItem {
  id: string;
  questionPaperId: string;
  sectionId?: string;
  
  // Source
  questionId?: string;
  isCustom: boolean;
  
  // Custom Question Data
  customQuestion?: string;
  customOptions?: string[];
  customCorrectAnswer?: string;
  customExplanation?: string;
  customDifficulty?: string;
  
  // Paper-specific
  marks: number;
  timeLimit?: number;
  questionNumber: number;
  sectionQuestionNumber?: number;
}