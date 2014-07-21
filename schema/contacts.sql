DROP TABLE IF EXISTS `user_contacts`;
CREATE TABLE `user_contacts` (
  `id` INT(12) NOT NULL AUTO_INCREMENT,
  `user_id` INT(12) NOT NULL,
  `contact_name` VARCHAR(255) NOT NULL,
  `contact_areacode` VARCHAR(45) NOT NULL,
  `contact_number` VARCHAR(45) NOT NULL,
  `contact_email` VARCHAR(100) NOT NULL,
  'date_create' DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);
