DROP TABLE IF EXISTS `user_pic`;
CREATE TABLE `user_pic` (
  `id` INT(12) NOT NULL AUTO_INCREMENT,
  `user_id` INT(12) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_dir` VARCHAR(255) NOT NULL,
  `pic_blob` LONGBLOB NOT NULL,
  PRIMARY KEY (`id`)
);
