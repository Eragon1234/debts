CREATE TABLE `counter` (
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`from`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `counter_from_to_unique` ON `counter` (`from`,`to`);