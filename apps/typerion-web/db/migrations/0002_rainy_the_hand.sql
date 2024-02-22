ALTER TABLE "notebook" ADD COLUMN "parent_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notebook" ADD CONSTRAINT "notebook_parent_id_notebook_id_fk" FOREIGN KEY ("parent_id") REFERENCES "notebook"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
