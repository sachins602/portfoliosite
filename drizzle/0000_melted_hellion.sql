CREATE TABLE `portfoliosite_contact_submission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`email` text(256) NOT NULL,
	`message` text NOT NULL,
	`isRead` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfoliosite_setting` (
	`key` text(256) PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
