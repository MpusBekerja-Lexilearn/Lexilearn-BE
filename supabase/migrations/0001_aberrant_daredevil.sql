ALTER TABLE "screening_answer_details" ADD COLUMN "answer_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screening_answer_details" ADD CONSTRAINT "screening_answer_details_answer_id_screening_answers_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."screening_answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
