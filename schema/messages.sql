DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `message` text,
  `datecreated` DATETIME NOT NULL,
  `from` INT(12) NOT NULL,
  PRIMARY KEY (`id`)
);


ALTER TABLE `messages`
ADD INDEX `Fk_user_user_id_idx` (`user_id` ASC),
ADD INDEX `Fk_user_receiver_id_idx` (`receiver_id` ASC);
ALTER TABLE `chismosa`.`messages`
ADD CONSTRAINT `Fk_user_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `chismosa`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `Fk_user_receiver_id`
  FOREIGN KEY (`receiver_id`)
  REFERENCES `chismosa`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
