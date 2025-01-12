CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_token_id_token_pk" PRIMARY KEY("id","token")
);
