export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  bufferTime: number;
  accessType: string;
  maxAttempts: number;
  retakeDelay: number;
  enableProctoring: boolean;
  requireWebcam: boolean;
  requireMicrophone: boolean;
  allowTabSwitch: boolean;
  maxTabSwitches: number;
  showQuestionNumbers: boolean;
  showTimer: boolean;
  showRemainingQuestions: boolean;
  allowQuestionNavigation: boolean;
  allowQuestionReview: boolean;
  allowAnswerChange: boolean;
  showResultImmediately: boolean;
  showAnswersAfterExam: boolean;
  showLeaderboard: boolean;
  resultReleaseTime?: string;
  passingScore: number;
  gradingMethod: string;
  allowNegativeMarking: boolean;
  negativeMarkingPerQuestion: number;
  totalRegistered: number;
  totalAttempted: number;
  averageScore: number;
  createdBy: string;
  questionPaperId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamRegistration {
  id: string;
  examId: string;
  userId: string;
  status: string;
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: string;
  attemptsUsed: number;
  lastAttemptAt?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  registrationId: string;
  startedAt: string;
  scheduledEndAt: string;
  submittedAt?: string;
  timeSpent: number;
  status: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  negativeMarks: number;
  finalScore: number;
  result?: string;
  rank?: number;
  percentile?: number;
}

export interface QuestionPaper {
  id: string;
  title: string;
  description?: string;
  code: string;
  totalMarks: number;
  duration: number;
  totalQuestions: number;
  creationMethod: string;
  status: string;
  createdBy: string;
}

export interface QuestionPaperItem {
  id: string;
  questionPaperId: string;
  questionId?: string;
  isCustom: boolean;
  customQuestion?: string;
  customOptionA?: string;
  customOptionB?: string;
  customOptionC?: string;
  customOptionD?: string;
  customCorrectAnswer?: string;
  customExplanation?: string;
  marks: number;
  questionNumber: number;
}

export interface QuestionBank {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  subjectId?: string;
  examTypeId?: string;
  difficultyLevel: string;
  marks: number;
  hasImage: boolean;
  imageUrl?: string;
}

export interface UserAnswer {
  id: string;
  attemptId: string;
  questionPaperItemId: string;
  selectedOption?: string;
  isCorrect?: boolean;
  marksObtained: number;
  negativeMarks: number;
  timeSpent: number;
  answeredAt: string;
  isFlagged: boolean;
}