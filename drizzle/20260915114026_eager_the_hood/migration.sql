PRAGMA
foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_password_credentials`
(
    `user_id`  integer PRIMARY KEY,
    `password` text NOT NULL,
    CONSTRAINT `password_credentials_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_password_credentials`(`user_id`, `password`)
SELECT `user_id`, `password`
FROM `password_credentials`;--> statement-breakpoint
DROP TABLE `password_credentials`;--> statement-breakpoint
ALTER TABLE `__new_password_credentials` RENAME TO `password_credentials`;--> statement-breakpoint
PRAGMA
foreign_keys=ON;