CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"user_id" integer NOT NULL,
	"mimetype" text NOT NULL,
	"size" double precision NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"readable_by" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
