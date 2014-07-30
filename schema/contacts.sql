DROP TABLE IF EXISTS `user_contacts`;
CREATE TABLE `user_contacts` (
  `id` INT(12) NOT NULL AUTO_INCREMENT,
  `user_id` INT(12) NOT NULL,
  `friend_id` INT(12) NOT NULL,
  `status` ENUM('0','1','2') DEFAULT '0',
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (friend_id) REFERENCES user(id)
);
