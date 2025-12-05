CREATE TYPE "public"."correct_answer" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
CREATE TYPE "public"."difficulty_level" AS ENUM('easy', 'medium', 'hard', 'analytical');--> statement-breakpoint
CREATE TYPE "public"."exam_creation_method" AS ENUM('manual', 'random', 'mixed', 'template');--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"thumbnail" text,
	"is_public" boolean DEFAULT true,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_series" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_type_id" text,
	"name" text NOT NULL,
	"full_name" text,
	"year" integer,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_code" text,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exam" (
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
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"estimated_marks" integer DEFAULT 0,
	"importance" text DEFAULT 'medium',
	"subject_id" text NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_bank" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_answer" "correct_answer" NOT NULL,
	"explanation" text,
	"subject_id" text,
	"exam_type_id" text,
	"exam_series_id" text,
	"topic_id" text,
	"difficulty_level" "difficulty_level" NOT NULL,
	"standard_id" text,
	"question_number" integer,
	"marks" integer DEFAULT 1,
	"time_limit" integer DEFAULT 60,
	"has_image" boolean DEFAULT false,
	"image_url" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "question_bank_subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_paper_items" (
	"id" text PRIMARY KEY NOT NULL,
	"question_paper_id" text NOT NULL,
	"section_id" text,
	"question_id" text,
	"is_custom" boolean DEFAULT false,
	"custom_question" text,
	"custom_option_a" text,
	"custom_option_b" text,
	"custom_option_c" text,
	"custom_option_d" text,
	"custom_correct_answer" "correct_answer",
	"custom_explanation" text,
	"custom_difficulty" "difficulty_level",
	"marks" integer DEFAULT 1,
	"time_limit" integer,
	"question_number" integer NOT NULL,
	"section_question_number" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_paper_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"structure" json,
	"default_criteria" json,
	"created_by" text NOT NULL,
	"is_public" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_papers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"code" text,
	"creation_method" "exam_creation_method" DEFAULT 'manual' NOT NULL,
	"source_type" text DEFAULT 'bank',
	"uploaded_file_url" text,
	"generation_criteria" json,
	"sections" json,
	"exam_id" text,
	"duration" integer,
	"total_marks" integer DEFAULT 100,
	"passing_score" integer DEFAULT 40,
	"shuffle_questions" boolean DEFAULT true,
	"shuffle_options" boolean DEFAULT true,
	"show_explanation" boolean DEFAULT false,
	"allow_review" boolean DEFAULT true,
	"negative_marking" json DEFAULT '{"enabled":false,"perIncorrect":0.25}'::json,
	"scheduled_at" timestamp,
	"result_release" text DEFAULT 'instant',
	"result_release_at" timestamp,
	"status" text DEFAULT 'draft',
	"version" integer DEFAULT 1,
	"created_by" text NOT NULL,
	"reviewed_by" text,
	"approved_by" text,
	"usage_count" integer DEFAULT 0,
	"average_score" integer,
	"difficulty_score" integer,
	"tags" text[],
	"is_template" boolean DEFAULT false,
	"template_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	CONSTRAINT "question_papers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "standards" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" integer,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"course_id" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject_id" text,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"course_id" text NOT NULL,
	"completed" boolean DEFAULT false,
	"score" integer,
	"time_spent" integer,
	"last_accessed" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "createdAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "updatedAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dateOfBirth" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "institution" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "degree" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "graduationYear" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "cgpa" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bcsExam" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "targetCadre" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preparationStart" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "studyHours" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stats" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferences" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_series" ADD CONSTRAINT "exam_series_exam_type_id_exam_types_id_fk" FOREIGN KEY ("exam_type_id") REFERENCES "public"."exam_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam" ADD CONSTRAINT "exam_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam" ADD CONSTRAINT "exam_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam" ADD CONSTRAINT "exam_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_subject_id_question_bank_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."question_bank_subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_exam_type_id_exam_types_id_fk" FOREIGN KEY ("exam_type_id") REFERENCES "public"."exam_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_exam_series_id_exam_series_id_fk" FOREIGN KEY ("exam_series_id") REFERENCES "public"."exam_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_paper_items" ADD CONSTRAINT "question_paper_items_question_paper_id_question_papers_id_fk" FOREIGN KEY ("question_paper_id") REFERENCES "public"."question_papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_paper_items" ADD CONSTRAINT "question_paper_items_question_id_question_bank_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question_bank"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_paper_templates" ADD CONSTRAINT "question_paper_templates_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_template_id_question_papers_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."question_papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_question_bank_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."question_bank_subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;