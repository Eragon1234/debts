CREATE TABLE `oidc_credentials`
(
    `id`       integer PRIMARY KEY NOT NULL,
    `user_id`  integer             NOT NULL,
    `provider` text                NOT NULL,
    `subject`  text                NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oidc_credentials_provider_subject_unique` ON `oidc_credentials` (`provider`, `subject`);