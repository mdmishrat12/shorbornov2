// types/exam.types.ts
export type ExamStatus = 'draft' | 'scheduled' | 'live' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
export type ExamAttemptStatus = 'not_started' | 'in_progress' | 'submitted' | 'timed_out' | 'auto_submitted' | 'review_pending' | 'reviewed' | 'disqualified';
export type AccessType = 'public' | 'private' | 'invite_only';
export type GradingMethod = 'auto' | 'manual' | 'mixed';

export interface ExamFormData {
  // Basic Info
  title: string;
  description?: string;
  code?: string;
  
  // Question Paper
  questionPaperId: string;
  
  // Scheduling
  scheduledStart: string; // ISO string
  scheduledEnd: string; // ISO string
  duration: number; // in minutes
  bufferTime?: number;
  
  // Access Control
  accessType: AccessType;
  password?: string;
  maxAttempts?: number;
  retakeDelay?: number;
  
  // Proctoring
  enableProctoring?: boolean;
  requireWebcam?: boolean;
  requireMicrophone?: boolean;
  allowTabSwitch?: boolean;
  maxTabSwitches?: number;
  
  // Display Settings
  showQuestionNumbers?: boolean;
  showTimer?: boolean;
  showRemainingQuestions?: boolean;
  allowQuestionNavigation?: boolean;
  allowQuestionReview?: boolean;
  allowAnswerChange?: boolean;
  
  // Result Settings
  showResultImmediately?: boolean;
  showAnswersAfterExam?: boolean;
  showLeaderboard?: boolean;
  resultReleaseTime?: string;
  
  // Grading
  passingScore?: number;
  gradingMethod?: GradingMethod;
  allowNegativeMarking?: boolean;
  negativeMarkingPerQuestion?: number;
  
  // Metadata
  tags?: string[];
}

export interface ExamSchedule {
  start: Date;
  end: Date;
  duration: number;
  timezone?: string;
  allowLateStart?: boolean;
  lateStartWindow?: number; // in minutes
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  status: ExamAttemptStatus;
  startedAt: Date;
  scheduledEndAt: Date;
  submittedAt?: Date;
  timeSpent?: number;
  score?: number;
  percentage?: number;
  rank?: number;
}

export interface ExamRegistration {
  examId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  registeredAt: Date;
  approvedAt?: Date;
  attemptsUsed: number;
}

export interface RealTimeExamData {
  currentQuestion: number;
  totalQuestions: number;
  remainingTime: number;
  answeredQuestions: number;
  flaggedQuestions: number[];
  lastSaved: Date;
}