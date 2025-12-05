CREATE TYPE "public"."exam_attempt_status" AS ENUM('not_started', 'in_progress', 'submitted', 'timed_out', 'auto_submitted', 'review_pending', 'reviewed', 'disqualified');--> statement-breakpoint
CREATE TYPE "public"."exam_status" AS ENUM('draft', 'scheduled', 'live', 'in_progress', 'completed', 'cancelled', 'archived');--> statement-breakpoint
CREATE TABLE "course_exam" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"lesson_id" text,
	"subject_id" text,
	"course_id" text NOT NULL,
	"total_questions" integer DEFAULT 0,
	"time_limit" integer,
	"passing_score" integer DEFAULT 60,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"priority" text DEFAULT 'normal',
	"published_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"target_audience" text DEFAULT 'all',
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text NOT NULL,
	"user_id" text NOT NULL,
	"registration_id" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"scheduled_end_at" timestamp,
	"submitted_at" timestamp,
	"time_spent" integer,
	"remaining_time" integer,
	"status" "exam_attempt_status" DEFAULT 'not_started',
	"completion_status" text DEFAULT 'not_started',
	"shuffle_seed" integer,
	"proctoring_score" integer DEFAULT 100,
	"tab_switches" integer DEFAULT 0,
	"warning_count" integer DEFAULT 0,
	"disqualified_reason" text,
	"total_questions" integer DEFAULT 0,
	"attempted_questions" integer DEFAULT 0,
	"correct_answers" integer DEFAULT 0,
	"incorrect_answers" integer DEFAULT 0,
	"skipped_questions" integer DEFAULT 0,
	"total_marks" integer DEFAULT 0,
	"obtained_marks" integer DEFAULT 0,
	"percentage" integer DEFAULT 0,
	"negative_marks" integer DEFAULT 0,
	"final_score" integer DEFAULT 0,
	"graded_by" text,
	"graded_at" timestamp,
	"grading_notes" text,
	"result" text DEFAULT 'pending',
	"rank" integer,
	"percentile" integer,
	"is_under_review" boolean DEFAULT false,
	"review_notes" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_leaderboard" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text NOT NULL,
	"user_id" text NOT NULL,
	"attempt_id" text NOT NULL,
	"score" integer NOT NULL,
	"percentage" integer NOT NULL,
	"rank" integer NOT NULL,
	"time_taken" integer NOT NULL,
	"submission_time" timestamp NOT NULL,
	"accuracy" integer NOT NULL,
	"questions_attempted" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"calculated_at" timestamp DEFAULT now(),
	CONSTRAINT "exam_leaderboard_exam_id_user_id_unique" UNIQUE("exam_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "exam_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text NOT NULL,
	"user_id" text NOT NULL,
	"registration_type" text DEFAULT 'regular',
	"registered_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"approved_by" text,
	"access_code" text,
	"seat_number" text,
	"status" text DEFAULT 'pending',
	"rejection_reason" text,
	"attempts_used" integer DEFAULT 0,
	"last_attempt_at" timestamp,
	"next_attempt_allowed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "exam_registrations_exam_id_user_id_unique" UNIQUE("exam_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "exam_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"user_id" text NOT NULL,
	"session_token" text NOT NULL,
	"socket_id" text,
	"ip_address" text,
	"user_agent" text,
	"current_question" integer DEFAULT 1,
	"last_activity" timestamp DEFAULT now(),
	"last_synced" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"disconnected_at" timestamp,
	"reconnected_at" timestamp,
	"events" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"code" text,
	"question_paper_id" text NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"buffer_time" integer DEFAULT 15,
	"access_type" text DEFAULT 'public',
	"password" text,
	"max_attempts" integer DEFAULT 1,
	"retake_delay" integer,
	"enable_proctoring" boolean DEFAULT false,
	"require_webcam" boolean DEFAULT false,
	"require_microphone" boolean DEFAULT false,
	"allow_tab_switch" boolean DEFAULT false,
	"max_tab_switches" integer DEFAULT 0,
	"show_question_numbers" boolean DEFAULT true,
	"show_timer" boolean DEFAULT true,
	"show_remaining_questions" boolean DEFAULT true,
	"allow_question_navigation" boolean DEFAULT true,
	"allow_question_review" boolean DEFAULT true,
	"allow_answer_change" boolean DEFAULT true,
	"show_result_immediately" boolean DEFAULT false,
	"show_answers_after_exam" boolean DEFAULT false,
	"show_leaderboard" boolean DEFAULT true,
	"result_release_time" timestamp,
	"passing_score" integer DEFAULT 40,
	"grading_method" text DEFAULT 'auto',
	"allow_negative_marking" boolean DEFAULT false,
	"negative_marking_per_question" integer DEFAULT 0,
	"status" "exam_status" DEFAULT 'draft',
	"created_by" text NOT NULL,
	"updated_by" text,
	"total_registered" integer DEFAULT 0,
	"total_attempted" integer DEFAULT 0,
	"average_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	CONSTRAINT "exams_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "proctoring_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"user_id" text NOT NULL,
	"event_type" text NOT NULL,
	"severity" text DEFAULT 'low',
	"description" text,
	"screenshot_url" text,
	"webcam_snapshot_url" text,
	"timestamp" timestamp DEFAULT now(),
	"ip_address" text,
	"user_agent" text,
	"action_taken" text,
	"action_by" text,
	"action_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"question_paper_item_id" text NOT NULL,
	"question_id" text,
	"selected_option" text,
	"is_correct" boolean,
	"marks_obtained" integer DEFAULT 0,
	"negative_marks" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"first_viewed_at" timestamp,
	"last_viewed_at" timestamp,
	"answered_at" timestamp,
	"is_flagged" boolean DEFAULT false,
	"is_reviewed" boolean DEFAULT false,
	"review_notes" text,
	"descriptive_answer" text,
	"descriptive_marks" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exam" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "exam" CASCADE;--> statement-breakpoint
ALTER TABLE "question_papers" DROP CONSTRAINT "question_papers_exam_id_exam_id_fk";
--> statement-breakpoint
ALTER TABLE "course_exam" ADD CONSTRAINT "course_exam_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_exam" ADD CONSTRAINT "course_exam_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_exam" ADD CONSTRAINT "course_exam_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_announcements" ADD CONSTRAINT "exam_announcements_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_announcements" ADD CONSTRAINT "exam_announcements_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_registration_id_exam_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."exam_registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_graded_by_user_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_leaderboard" ADD CONSTRAINT "exam_leaderboard_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_leaderboard" ADD CONSTRAINT "exam_leaderboard_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_leaderboard" ADD CONSTRAINT "exam_leaderboard_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_question_paper_id_question_papers_id_fk" FOREIGN KEY ("question_paper_id") REFERENCES "public"."question_papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_logs" ADD CONSTRAINT "proctoring_logs_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_logs" ADD CONSTRAINT "proctoring_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_logs" ADD CONSTRAINT "proctoring_logs_action_by_user_id_fk" FOREIGN KEY ("action_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_paper_item_id_question_paper_items_id_fk" FOREIGN KEY ("question_paper_item_id") REFERENCES "public"."question_paper_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_question_bank_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question_bank"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" DROP COLUMN "exam_id";