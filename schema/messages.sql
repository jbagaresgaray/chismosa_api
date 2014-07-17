DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `message` text,
  `datecreated` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);
