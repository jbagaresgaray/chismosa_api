DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT(12) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `areacode` VARCHAR(16) NOT NULL,
  `mobile_number` VARCHAR(25) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `gplus` VARCHAR(45) NOT NULL,
  `gplus_password` VARCHAR(255) NOT NULL,
  `facebook` VARCHAR(45) NOT NULL,
  `facebook_password` VARCHAR(255) NOT NULL,
  `twitter` VARCHAR(45) NOT NULL,
  `twitter_password` VARCHAR(255) NOT NULL,
  `linkedin` VARCHAR(45) NOT NULL,
  `linkedin_password` VARCHAR(255) NOT NULL,
  `active` BIT DEFAULT 0 NOT NULL,
  `datecreated` DATETIME NOT NULL,
  `dateupdated` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);
