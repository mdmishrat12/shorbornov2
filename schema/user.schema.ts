// schema.ts
import { pgTable, text, timestamp, primaryKey, integer, boolean, json, varchar, pgEnum, unique } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';

// Enums must be created first
export const difficultyEnum = pgEnum('difficulty_level', ['easy', 'medium', 'hard', 'analytical']);
export const correctAnswerEnum = pgEnum('correct_answer', ['A', 'B', 'C', 'D']);
export const examCreationMethodEnum = pgEnum('exam_creation_method', ['manual', 'random', 'mixed', 'template']);
export const examStatusEnum = pgEnum('exam_status', [
  'draft', 
  'scheduled', 
  'live', 
  'in_progress', 
  'completed', 
  'cancelled', 
  'archived'
]);
export const examAttemptStatusEnum = pgEnum('exam_attempt_status', [
  'not_started',
  'in_progress',
  'submitted',
  'timed_out',
  'auto_submitted',
  'review_pending',
  'reviewed',
  'disqualified'
]);

// Users table - must come first since it's referenced by others
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").default('student'),
  phone: text("phone"),
  dateOfBirth: text("dateOfBirth"),
  gender: text("gender"),
  address: text("address"),
  institution: text("institution"),
  degree: text("degree"),
  graduationYear: text("graduationYear"),
  cgpa: text("cgpa"),
  bcsExam: text("bcsExam"),
  targetCadre: text("targetCadre"),
  preparationStart: text("preparationStart"),
  studyHours: text("studyHours"),
  stats: json("stats").$type<{
    examsTaken: number;
    totalQuestions: number;
    averageScore: number;
    accuracy: number;
    currentRank: number;
    improvement: number;
    streak: number;
    studyTime: string;
  }>(),
  preferences: json("preferences").$type<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    weeklyReports: boolean;
    publicProfile: boolean;
    language: string;
    theme: string;
  }>(),
  subscription: json("subscription").$type<{
    plan: string;
    status: string;
    since: string;
    expires: string;
    features: string[];
  }>(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

// NextAuth tables
export const accounts = pgTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

// Courses
export const courses = pgTable("course", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  isPublic: boolean("is_public").default(true),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Subjects (for courses)
export const subjects = pgTable("subject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Lessons
export const lessons = pgTable("lesson", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  estimatedMarks: integer("estimated_marks").default(0),
  importance: text("importance").default('medium'),
  subjectId: text("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false),
  score: integer("score"),
  timeSpent: integer("time_spent"),
  lastAccessed: timestamp("last_accessed", { mode: "date" }).defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Course Exams (legacy - for course-based exams)
export const courseExams = pgTable("course_exam", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  totalQuestions: integer("total_questions").default(0),
  timeLimit: integer("time_limit"),
  passingScore: integer("passing_score").default(60),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Posts
export const posts = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

// Question Bank System
export const questionBankSubjects = pgTable('question_bank_subjects', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const examTypes = pgTable('exam_types', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortCode: text("short_code"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examSeries = pgTable('exam_series', {
  id: text("id").primaryKey(),
  examTypeId: text("exam_type_id").references(() => examTypes.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  fullName: text("full_name"),
  year: integer("year"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const topics = pgTable('topics', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subjectId: text("subject_id").references(() => questionBankSubjects.id, { onDelete: 'cascade' }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const standards = pgTable('standards', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionBank = pgTable('question_bank', {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: correctAnswerEnum("correct_answer").notNull(),
  explanation: text("explanation"),
  subjectId: text("subject_id").references(() => questionBankSubjects.id, { onDelete: 'cascade' }),
  examTypeId: text("exam_type_id").references(() => examTypes.id),
  examSeriesId: text("exam_series_id").references(() => examSeries.id),
  topicId: text("topic_id").references(() => topics.id),
  difficultyLevel: difficultyEnum("difficulty_level").notNull(),
  standardId: text("standard_id").references(() => standards.id),
  questionNumber: integer("question_number"),
  marks: integer("marks").default(1),
  timeLimit: integer("time_limit").default(60),
  hasImage: boolean("has_image").default(false),
  imageUrl: text("image_url"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Question Papers
export const questionPapers = pgTable('question_papers', {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").unique(),
  examId: text("exam_id").references(() => exams.id, { onDelete: 'cascade' }),

  creationMethod: examCreationMethodEnum("creation_method").notNull().default('manual'),
  sourceType: text("source_type").default('bank'),
  uploadedFileUrl: text("uploaded_file_url"),
  generationCriteria: json("generation_criteria").$type<{
    subjectIds: string[];
    examTypeIds: string[];
    examSeriesIds: string[];
    topicIds: string[];
    difficultyLevels: ('easy' | 'medium' | 'hard' | 'analytical')[];
    standardIds: string[];
    totalQuestions: number;
    questionsPerDifficulty?: {
      easy?: number;
      medium?: number;
      hard?: number;
      analytical?: number;
    };
    marksPerQuestion: number;
    timePerQuestion: number;
    includeExplanation: boolean;
    shuffleQuestions: boolean;
  }>(),
  sections: json("sections").$type<Array<{
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
    questions?: Array<{
      id: string;
      questionId?: string;
      customQuestion?: string;
      customOptions?: string[];
      customCorrectAnswer?: string;
      customExplanation?: string;
      marks: number;
      order: number;
    }>;
  }>>(),
  duration: integer("duration"),
  totalMarks: integer("total_marks").default(100),
  passingScore: integer("passing_score").default(40),
  shuffleQuestions: boolean("shuffle_questions").default(true),
  shuffleOptions: boolean("shuffle_options").default(true),
  showExplanation: boolean("show_explanation").default(false),
  allowReview: boolean("allow_review").default(true),
  negativeMarking: json("negative_marking").$type<{
    enabled: boolean;
    perIncorrect: number;
  }>().default({ enabled: false, perIncorrect: 0.25 }),
  scheduledAt: timestamp("scheduled_at"),
  resultRelease: text("result_release").default('instant'),
  resultReleaseAt: timestamp("result_release_at"),
  status: text("status").default('draft'),
  version: integer("version").default(1),
  createdBy: text("created_by").notNull().references(() => users.id),
  reviewedBy: text("reviewed_by").references(() => users.id),
  approvedBy: text("approved_by").references(() => users.id),
  usageCount: integer("usage_count").default(0),
  averageScore: integer("average_score"),
  difficultyScore: integer("difficulty_score"),
  tags: text("tags").array(),
  isTemplate: boolean("is_template").default(false),
  templateId: text("template_id").references(() => questionPapers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

// Question Paper Items
export const questionPaperItems = pgTable('question_paper_items', {
  id: text("id").primaryKey(),
  questionPaperId: text("question_paper_id").notNull().references(() => questionPapers.id, { onDelete: 'cascade' }),
  sectionId: text("section_id"),
  questionId: text("question_id").references(() => questionBank.id, { onDelete: 'cascade' }),
  isCustom: boolean("is_custom").default(false),
  customQuestion: text("custom_question"),
  customOptionA: text("custom_option_a"),
  customOptionB: text("custom_option_b"),
  customOptionC: text("custom_option_c"),
  customOptionD: text("custom_option_d"),
  customCorrectAnswer: correctAnswerEnum("custom_correct_answer"),
  customExplanation: text("custom_explanation"),
  customDifficulty: difficultyEnum("custom_difficulty"),
  marks: integer("marks").default(1),
  timeLimit: integer("time_limit"),
  questionNumber: integer("question_number").notNull(),
  sectionQuestionNumber: integer("section_question_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Question Paper Templates
export const questionPaperTemplates = pgTable('question_paper_templates', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  structure: json("structure").$type<{
    sections: Array<{
      title: string;
      subjectIds?: string[];
      questionTypes?: string[];
      totalQuestions: number;
      marksDistribution: Record<string, number>;
      difficultyDistribution?: Record<string, number>;
    }>;
    totalMarks: number;
    duration: number;
    passingScore: number;
  }>(),
  defaultCriteria: json("default_criteria").$type<{
    subjectIds: string[];
    difficultyLevels: string[];
    excludeUsedQuestions: boolean;
    maxUsagePerQuestion: number;
  }>(),
  createdBy: text("created_by").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exams (main exam system)
export const exams = pgTable("exams", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").unique(),
  questionPaperId: text("question_paper_id").notNull().references(() => questionPapers.id, { onDelete: 'cascade' }),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  duration: integer("duration").notNull(),
  bufferTime: integer("buffer_time").default(15),
  accessType: text("access_type").default('public'),
  password: text("password"),
  maxAttempts: integer("max_attempts").default(1),
  retakeDelay: integer("retake_delay"),
  enableProctoring: boolean("enable_proctoring").default(false),
  requireWebcam: boolean("require_webcam").default(false),
  requireMicrophone: boolean("require_microphone").default(false),
  allowTabSwitch: boolean("allow_tab_switch").default(false),
  maxTabSwitches: integer("max_tab_switches").default(0),
  showQuestionNumbers: boolean("show_question_numbers").default(true),
  showTimer: boolean("show_timer").default(true),
  showRemainingQuestions: boolean("show_remaining_questions").default(true),
  allowQuestionNavigation: boolean("allow_question_navigation").default(true),
  allowQuestionReview: boolean("allow_question_review").default(true),
  allowAnswerChange: boolean("allow_answer_change").default(true),
  showResultImmediately: boolean("show_result_immediately").default(false),
  showAnswersAfterExam: boolean("show_answers_after_exam").default(false),
  showLeaderboard: boolean("show_leaderboard").default(true),
  resultReleaseTime: timestamp("result_release_time"),
  passingScore: integer("passing_score").default(40),
  gradingMethod: text("grading_method").default('auto'),
  allowNegativeMarking: boolean("allow_negative_marking").default(false),
  negativeMarkingPerQuestion: integer("negative_marking_per_question").default(0),
  status: examStatusEnum("status").default('draft'),
  createdBy: text("created_by").notNull().references(() => users.id),
  updatedBy: text("updated_by").references(() => users.id),
  totalRegistered: integer("total_registered").default(0),
  totalAttempted: integer("total_attempted").default(0),
  averageScore: integer("average_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

// Exam Registration
export const examRegistrations = pgTable('exam_registrations', {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  registrationType: text("registration_type").default('regular'),
  registeredAt: timestamp("registered_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => users.id), // Make sure this allows null
  accessCode: text("access_code"),
  seatNumber: text("seat_number"),
  status: text("status").default('pending'),
  rejectionReason: text("rejection_reason"),
  attemptsUsed: integer("attempts_used").default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  nextAttemptAllowedAt: timestamp("next_attempt_allowed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueExamUser: unique().on(table.examId, table.userId),
}));

// Exam Attempts
export const examAttempts = pgTable('exam_attempts', {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  registrationId: text("registration_id").references(() => examRegistrations.id),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  scheduledEndAt: timestamp("scheduled_end_at"),
  submittedAt: timestamp("submitted_at"),
  timeSpent: integer("time_spent"),
  remainingTime: integer("remaining_time"),
  status: examAttemptStatusEnum("status").default('not_started'),
  completionStatus: text("completion_status").default('not_started'),
  shuffleSeed: integer("shuffle_seed"),
  proctoringScore: integer("proctoring_score").default(100),
  tabSwitches: integer("tab_switches").default(0),
  warningCount: integer("warning_count").default(0),
  disqualifiedReason: text("disqualified_reason"),
  totalQuestions: integer("total_questions").default(0),
  attemptedQuestions: integer("attempted_questions").default(0),
  correctAnswers: integer("correct_answers").default(0),
  incorrectAnswers: integer("incorrect_answers").default(0),
  skippedQuestions: integer("skipped_questions").default(0),
  totalMarks: integer("total_marks").default(0),
  obtainedMarks: integer("obtained_marks").default(0),
  percentage: integer("percentage").default(0),
  negativeMarks: integer("negative_marks").default(0),
  finalScore: integer("final_score").default(0),
  gradedBy: text("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  gradingNotes: text("grading_notes"),
  result: text("result").default('pending'),
  rank: integer("rank"),
  percentile: integer("percentile"),
  isUnderReview: boolean("is_under_review").default(false),
  reviewNotes: text("review_notes"),
  reviewedBy: text("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Answers
export const userAnswers = pgTable('user_answers', {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id").notNull().references(() => examAttempts.id, { onDelete: 'cascade' }),
  questionPaperItemId: text("question_paper_item_id").notNull().references(() => questionPaperItems.id),
  questionId: text("question_id").references(() => questionBank.id),
  selectedOption: text("selected_option"),
  isCorrect: boolean("is_correct"),
  marksObtained: integer("marks_obtained").default(0),
  negativeMarks: integer("negative_marks").default(0),
  timeSpent: integer("time_spent").default(0),
  firstViewedAt: timestamp("first_viewed_at"),
  lastViewedAt: timestamp("last_viewed_at"),
  answeredAt: timestamp("answered_at"),
  isFlagged: boolean("is_flagged").default(false),
  isReviewed: boolean("is_reviewed").default(false),
  reviewNotes: text("review_notes"),
  descriptiveAnswer: text("descriptive_answer"),
  descriptiveMarks: integer("descriptive_marks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exam Sessions
export const examSessions = pgTable('exam_sessions', {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id").notNull().references(() => examAttempts.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => users.id),
  sessionToken: text("session_token").notNull(),
  socketId: text("socket_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  currentQuestion: integer("current_question").default(1),
  lastActivity: timestamp("last_activity").defaultNow(),
  lastSynced: timestamp("last_synced").defaultNow(),
  isActive: boolean("is_active").default(true),
  disconnectedAt: timestamp("disconnected_at"),
  reconnectedAt: timestamp("reconnected_at"),
  events: json("events").$type<Array<{
    type: string;
    timestamp: string;
    data: any;
  }>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exam Proctoring Logs
export const proctoringLogs = pgTable('proctoring_logs', {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id").notNull().references(() => examAttempts.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => users.id),
  eventType: text("event_type").notNull(),
  severity: text("severity").default('low'),
  description: text("description"),
  screenshotUrl: text("screenshot_url"),
  webcamSnapshotUrl: text("webcam_snapshot_url"),
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  actionTaken: text("action_taken"),
  actionBy: text("action_by").references(() => users.id),
  actionAt: timestamp("action_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exam Announcements
export const examAnnouncements = pgTable('exam_announcements', {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").default('normal'),
  publishedAt: timestamp("published_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  targetAudience: text("target_audience").default('all'),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exam Leaderboard
export const examLeaderboard = pgTable('exam_leaderboard', {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => users.id),
  attemptId: text("attempt_id").notNull().references(() => examAttempts.id, { onDelete: 'cascade' }),
  score: integer("score").notNull(),
  percentage: integer("percentage").notNull(),
  rank: integer("rank").notNull(),
  timeTaken: integer("time_taken").notNull(),
  submissionTime: timestamp("submission_time").notNull(),
  accuracy: integer("accuracy").notNull(),
  questionsAttempted: integer("questions_attempted").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow(),
}, (table) => ({
  uniqueExamUser: unique().on(table.examId, table.userId),
}));

// ===== RELATIONS =====

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  questions: many(questionBank),
  posts: many(posts),
  progress: many(userProgress),
  accounts: many(accounts),
  sessions: many(sessions),
  createdExams: many(exams),
  examRegistrations: many(examRegistrations),
  examAttempts: many(examAttempts),
}));

// Courses Relations
export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  subjects: many(subjects),
  courseExams: many(courseExams),
  progress: many(userProgress),
}));

// Subjects Relations
export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  course: one(courses, {
    fields: [subjects.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
  courseExams: many(courseExams),
}));

// Lessons Relations
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [lessons.subjectId],
    references: [subjects.id],
  }),
  courseExams: many(courseExams),
  progress: many(userProgress),
}));

// Course Exams Relations (legacy)
export const courseExamsRelations = relations(courseExams, ({ one }) => ({
  course: one(courses, {
    fields: [courseExams.courseId],
    references: [courses.id],
  }),
  subject: one(subjects, {
    fields: [courseExams.subjectId],
    references: [subjects.id],
  }),
  lesson: one(lessons, {
    fields: [courseExams.lessonId],
    references: [lessons.id],
  }),
}));

// User Progress Relations
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
}));

// Posts Relations
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

// Accounts Relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Sessions Relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Question Bank Relations
export const questionBankSubjectsRelations = relations(questionBankSubjects, ({ many }) => ({
  topics: many(topics),
  questions: many(questionBank),
}));

export const examTypesRelations = relations(examTypes, ({ many }) => ({
  examSeries: many(examSeries),
  questions: many(questionBank),
}));

export const examSeriesRelations = relations(examSeries, ({ one, many }) => ({
  examType: one(examTypes, {
    fields: [examSeries.examTypeId],
    references: [examTypes.id],
  }),
  questions: many(questionBank),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(questionBankSubjects, {
    fields: [topics.subjectId],
    references: [questionBankSubjects.id],
  }),
  questions: many(questionBank),
}));

export const standardsRelations = relations(standards, ({ many }) => ({
  questions: many(questionBank),
}));

export const questionBankRelations = relations(questionBank, ({ one }) => ({
  subject: one(questionBankSubjects, {
    fields: [questionBank.subjectId],
    references: [questionBankSubjects.id],
  }),
  examType: one(examTypes, {
    fields: [questionBank.examTypeId],
    references: [examTypes.id],
  }),
  examSeries: one(examSeries, {
    fields: [questionBank.examSeriesId],
    references: [examSeries.id],
  }),
  topic: one(topics, {
    fields: [questionBank.topicId],
    references: [topics.id],
  }),
  standard: one(standards, {
    fields: [questionBank.standardId],
    references: [standards.id],
  }),
  createdByUser: one(users, {
    fields: [questionBank.createdBy],
    references: [users.id],
  }),
}));

// Question Papers Relations
export const questionPapersRelations = relations(questionPapers, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [questionPapers.createdBy],
    references: [users.id],
  }),
  reviewedByUser: one(users, {
    fields: [questionPapers.reviewedBy],
    references: [users.id],
  }),
  approvedByUser: one(users, {
    fields: [questionPapers.approvedBy],
    references: [users.id],
  }),
  template: one(questionPapers, {
    fields: [questionPapers.templateId],
    references: [questionPapers.id],
  }),
  items: many(questionPaperItems),
  exams: many(exams),
}));

export const questionPaperItemsRelations = relations(questionPaperItems, ({ one, many }) => ({
  questionPaper: one(questionPapers, {
    fields: [questionPaperItems.questionPaperId],
    references: [questionPapers.id],
  }),
  question: one(questionBank, {
    fields: [questionPaperItems.questionId],
    references: [questionBank.id],
  }),
  userAnswers: many(userAnswers),
}));

export const questionPaperTemplatesRelations = relations(questionPaperTemplates, ({ one }) => ({
  createdByUser: one(users, {
    fields: [questionPaperTemplates.createdBy],
    references: [users.id],
  }),
}));

// Exams Relations
export const examsRelations = relations(exams, ({ one, many }) => ({
  questionPaper: one(questionPapers, {
    fields: [exams.questionPaperId],
    references: [questionPapers.id],
  }),
  creator: one(users, {
    fields: [exams.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [exams.updatedBy],
    references: [users.id],
  }),
  registrations: many(examRegistrations),
  attempts: many(examAttempts),
  announcements: many(examAnnouncements),
  leaderboard: many(examLeaderboard),
}));

// Exam Registrations Relations
export const examRegistrationsRelations = relations(examRegistrations, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examRegistrations.examId],
    references: [exams.id],
  }),
  user: one(users, {
    fields: [examRegistrations.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [examRegistrations.approvedBy],
    references: [users.id],
  }),
  attempts: many(examAttempts),
}));

// Exam Attempts Relations
export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examAttempts.examId],
    references: [exams.id],
  }),
  user: one(users, {
    fields: [examAttempts.userId],
    references: [users.id],
  }),
  registration: one(examRegistrations, {
    fields: [examAttempts.registrationId],
    references: [examRegistrations.id],
  }),
  grader: one(users, {
    fields: [examAttempts.gradedBy],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [examAttempts.reviewedBy],
    references: [users.id],
  }),
  answers: many(userAnswers),
  sessions: many(examSessions),
  proctoringLogs: many(proctoringLogs),
  leaderboardEntry: one(examLeaderboard, {
    fields: [examAttempts.id],
    references: [examLeaderboard.attemptId],
  }),
}));

// User Answers Relations
export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [userAnswers.attemptId],
    references: [examAttempts.id],
  }),
  questionPaperItem: one(questionPaperItems, {
    fields: [userAnswers.questionPaperItemId],
    references: [questionPaperItems.id],
  }),
  question: one(questionBank, {
    fields: [userAnswers.questionId],
    references: [questionBank.id],
  }),
}));

// Exam Sessions Relations
export const examSessionsRelations = relations(examSessions, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [examSessions.attemptId],
    references: [examAttempts.id],
  }),
  user: one(users, {
    fields: [examSessions.userId],
    references: [users.id],
  }),
}));

// Proctoring Logs Relations
export const proctoringLogsRelations = relations(proctoringLogs, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [proctoringLogs.attemptId],
    references: [examAttempts.id],
  }),
  user: one(users, {
    fields: [proctoringLogs.userId],
    references: [users.id],
  }),
  actionByUser: one(users, {
    fields: [proctoringLogs.actionBy],
    references: [users.id],
  }),
}));

// Exam Announcements Relations
export const examAnnouncementsRelations = relations(examAnnouncements, ({ one }) => ({
  exam: one(exams, {
    fields: [examAnnouncements.examId],
    references: [exams.id],
  }),
  creator: one(users, {
    fields: [examAnnouncements.createdBy],
    references: [users.id],
  }),
}));

// Exam Leaderboard Relations
export const examLeaderboardRelations = relations(examLeaderboard, ({ one }) => ({
  exam: one(exams, {
    fields: [examLeaderboard.examId],
    references: [exams.id],
  }),
  user: one(users, {
    fields: [examLeaderboard.userId],
    references: [users.id],
  }),
  attempt: one(examAttempts, {
    fields: [examLeaderboard.attemptId],
    references: [examAttempts.id],
  }),
}));

// Export all tables and relations
export const tables = {
  users,
  accounts,
  sessions,
  verificationTokens,
  courses,
  subjects,
  lessons,
  userProgress,
  courseExams,
  posts,
  questionBankSubjects,
  examTypes,
  examSeries,
  topics,
  standards,
  questionBank,
  questionPapers,
  questionPaperItems,
  questionPaperTemplates,
  exams,
  examRegistrations,
  examAttempts,
  userAnswers,
  examSessions,
  proctoringLogs,
  examAnnouncements,
  examLeaderboard,
};

export const allRelations = {
  usersRelations,
  coursesRelations,
  subjectsRelations,
  lessonsRelations,
  courseExamsRelations,
  userProgressRelations,
  postsRelations,
  accountsRelations,
  sessionsRelations,
  questionBankSubjectsRelations,
  examTypesRelations,
  examSeriesRelations,
  topicsRelations,
  standardsRelations,
  questionBankRelations,
  questionPapersRelations,
  questionPaperItemsRelations,
  questionPaperTemplatesRelations,
  examsRelations,
  examRegistrationsRelations,
  examAttemptsRelations,
  userAnswersRelations,
  examSessionsRelations,
  proctoringLogsRelations,
  examAnnouncementsRelations,
  examLeaderboardRelations,
};