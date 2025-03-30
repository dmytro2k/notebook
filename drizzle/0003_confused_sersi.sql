CREATE TABLE IF NOT EXISTS "todos" (
	"todo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"todo_note" text NOT NULL,
	"user_id" uuid NOT NULL,
	"todo_date" date NOT NULL,
	"todo_is_done" boolean DEFAULT false NOT NULL,
	"todo_position" integer NOT NULL,
	CONSTRAINT "todos_user_id_todo_date_todo_position_unique" UNIQUE("user_id","todo_date","todo_position")
);
--> statement-breakpoint
ALTER TABLE "records" RENAME COLUMN "recordDate" TO "record_date";--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "record_position" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN IF EXISTS "record_title";--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN IF EXISTS "recordTime";--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_record_date_record_position_unique" UNIQUE("user_id","record_date","record_position");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_profile_name_unique" UNIQUE("profile_name");