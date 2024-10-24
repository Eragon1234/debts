ALTER TABLE `credentials` RENAME TO `passkey_credentials`;--> statement-breakpoint
CREATE TABLE `password_credentials` (
	`user_id` integer NOT NULL,
	`password` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_passkey_credentials` (
	`user_id` integer NOT NULL,
	`id` text NOT NULL,
	`public_key` text NOT NULL,
	`counter` integer NOT NULL,
	`backed_up` integer NOT NULL,
	`transports` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_passkey_credentials`("user_id", "id", "public_key", "counter", "backed_up", "transports") SELECT "user_id", "id", "public_key", "counter", "backed_up", "transports" FROM `passkey_credentials`;--> statement-breakpoint
DROP TABLE `passkey_credentials`;--> statement-breakpoint
ALTER TABLE `__new_passkey_credentials` RENAME TO `passkey_credentials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `passkey_credentials_id_unique` ON `passkey_credentials` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `passkey_credentials_user_id_id_unique` ON `passkey_credentials` (`user_id`,`id`);