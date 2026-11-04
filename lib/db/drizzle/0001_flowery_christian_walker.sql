CREATE TABLE "turki_appearance_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"primary_color" text DEFAULT '#4051F5' NOT NULL,
	"profile_image_size" integer DEFAULT 150 NOT NULL,
	"highlight_size" integer DEFAULT 58 NOT NULL,
	"content_width" integer DEFAULT 935 NOT NULL,
	"button_radius" integer DEFAULT 8 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "turki_media_files" ADD COLUMN "post_id" text;--> statement-breakpoint
ALTER TABLE "turki_media_files" ADD COLUMN "story_slot" integer;--> statement-breakpoint
ALTER TABLE "turki_posts" ADD COLUMN "status" text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "turki_posts" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "turki_posts" ADD COLUMN "restored_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "turki_media_files" ADD CONSTRAINT "turki_media_files_post_id_turki_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."turki_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turki_media_files" ADD CONSTRAINT "turki_media_files_story_slot_unique" UNIQUE("story_slot");