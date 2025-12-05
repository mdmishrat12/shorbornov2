import { Exam, ExamAttempt, UserAnswer } from "@/types";

export const calculateExamStatistics = (
  exam: Exam,
  attempts: ExamAttempt[]
) => {
  const submittedAttempts = attempts.filter(a => a.status === 'submitted');
  
  const totalAttempts = submittedAttempts.length;
  const totalParticipants = new Set(submittedAttempts.map(a => a.userId)).size;
  
  const averageScore = submittedAttempts.length > 0
    ? Math.round(submittedAttempts.reduce((sum, a) => sum + (a.finalScore || 0), 0) / submittedAttempts.length)
    : 0;
  
  const passRate = submittedAttempts.length > 0
    ? Math.round((submittedAttempts.filter(a => a.result === 'pass').length / submittedAttempts.length) * 100)
    : 0;
  
  return {
    totalAttempts,
    totalParticipants,
    averageScore,
    passRate,
  };
};

export const formatExamDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const getExamStatus = (
  scheduledStart: string,
  scheduledEnd: string,
  currentStatus: string
) => {
  const now = new Date();
  const start = new Date(scheduledStart);
  const end = new Date(scheduledEnd);
  
  if (currentStatus === 'cancelled' || currentStatus === 'archived') {
    return currentStatus;
  }
  
  if (now < start) return 'scheduled';
  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'live';
  
  return currentStatus;
};

export const calculateScore = (
  answers: UserAnswer[],
  questions: any[],
  allowNegativeMarking: boolean,
  negativeMarkingPerQuestion: number
) => {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  let obtainedMarks = 0;
  let negativeMarks = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionPaperItemId);
    
    if (!answer.selectedOption) {
      skipped++;
    } else if (question) {
      const isCorrect = answer.selectedOption === question.correctAnswer;
      
      if (isCorrect) {
        correct++;
        obtainedMarks += question.marks || 1;
      } else {
        incorrect++;
        if (allowNegativeMarking) {
          negativeMarks += negativeMarkingPerQuestion || 0.25;
        }
      }
    }
  });
  
  const finalScore = Math.max(0, obtainedMarks - negativeMarks);
  const percentage = questions.length > 0
    ? Math.round((finalScore / questions.reduce((sum, q) => sum + (q.marks || 1), 0)) * 100)
    : 0;
  
  return {
    correct,
    incorrect,
    skipped,
    obtainedMarks,
    negativeMarks,
    finalScore,
    percentage,
  };
};