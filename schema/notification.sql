DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `notify_desc` text,
  `datecreated` DATETIME NOT NULL,
  `is_read` TINYINT DEFAULT 0,
  PRIMARY KEY (`id`)
);

ALTER TABLE `notification`
ADD INDEX `Fk_user_notif_user_id_idx` (`user_id` ASC),
ADD INDEX `Fk_user_notif_receiver_id_idx` (`receiver_id` ASC);
ALTER TABLE `chismosa`.`notification`
ADD CONSTRAINT `Fk_user_notif_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `chismosa`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `Fk_user_notif_receiver_id`
  FOREIGN KEY (`receiver_id`)
  REFERENCES `chismosa`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

