CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"key" varchar(255),
	"analytics" jsonb,
	"csv" jsonb,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "sessions_uid_unique" UNIQUE("uid")
);
