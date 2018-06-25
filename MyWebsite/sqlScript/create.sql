CREATE USER '3150105426'@'localhost' IDENTIFIED BY '3150105426';
 ALTER USER '3150105426'@'localhost' IDENTIFIED WITH mysql_native_password BY '3150105426';
 GRANT all privileges on *.* to '3150105426'@'localhost' identified by '3150105426' with grant option;
 CREATE DATABASE mywordbook_user;
 USE mywordbook_user;
 CREATE TABLE `user_information` (
  `UID` int(11) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`UID`),
  UNIQUE KEY `UID_UNIQUE` (`UID`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `user_process` (
  `UID` int(11) NOT NULL,
  `wordCompleteNum` int(11) NOT NULL,
  PRIMARY KEY (`UID`),
  UNIQUE KEY `UID_UNIQUE` (`UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;