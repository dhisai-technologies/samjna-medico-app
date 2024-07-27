DO $$ BEGIN
 CREATE TYPE "public"."log_level" AS ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('ADMIN', 'DOCTOR', 'EMPLOYEE', 'INTERN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"user_id" integer NOT NULL,
	"mimetype" text NOT NULL,
	"size" double precision NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"readable_by" jsonb,
	"readable_upto" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"organization_id" integer,
	"log_level" "log_level" DEFAULT 'TRACE' NOT NULL,
	"message" text NOT NULL,
	"event" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(255) DEFAULT 'COMMON' NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"retries" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "otps_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" text,
	"role" "role" DEFAULT 'EMPLOYEE' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
