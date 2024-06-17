DO $$ BEGIN
 CREATE TYPE "public"."quiz_question_answer_type_enum" AS ENUM('text', 'scrumble', 'handwriting');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD COLUMN "answer_type" "quiz_question_answer_type_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD COLUMN "answer_list" text NOT NULL;