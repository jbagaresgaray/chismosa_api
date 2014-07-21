DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `message` text,
  `datecreated` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `messages1`;
CREATE TABLE `messages1` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `message` text,
  `datecreated` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `messages2`;
CREATE TABLE `messages2` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `user_id` int(12) NOT NULL,
  `receiver_id` int(12) NOT NULL,
  `message` text,
  `datecreated` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

