PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_decks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_decks`("id", "title", "date") SELECT "id", "title", "date" FROM `decks`;--> statement-breakpoint
DROP TABLE `decks`;--> statement-breakpoint
ALTER TABLE `__new_decks` RENAME TO `decks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `cards` ADD `date` text NOT NULL;