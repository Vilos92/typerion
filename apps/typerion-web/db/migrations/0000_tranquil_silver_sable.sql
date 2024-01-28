CREATE TABLE IF NOT EXISTS "notebook" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"typnb" json NOT NULL
);
