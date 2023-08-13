# Tables for application.

CREATE TABLE `users` (
  `user_id` varchar(200) NOT NULL PRIMARY KEY,
  `username` varchar(200) NOT NULL UNIQUE,
  `email` varchar(200) NOT NULL UNIQUE,
  `salt` varchar(200) NOT NULL,
  `views` varchar(200) NOT NULL,
  `type` enum('inner','staff','administrator') NOT NULL,
  `url` varchar(200) NOT NULL UNIQUE,
  `cover_photo_location` varchar(200) DEFAULT NULL,
  `createdAt` varchar(200) NOT NULL,
  `updatedAt` varchar(200) NOT NULL
);

CREATE TABLE `connections` (
  `user_id` varchar(200) NOT NULL,
  `connection_id` varchar(200) NOT NULL,
  PRIMARY KEY(user_id, connection_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(connection_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `opportunities` (
  `opportunity_id` varchar(200) NOT NULL PRIMARY KEY,
  `creator_id` varchar(200) NOT NULL,
  `title` mediumtext NOT NULL,
  `contents` mediumtext NOT NULL,
  `views` varchar(200) NOT NULL,
  `createdAt` varchar(200) NOT NULL,
  `updatedAt` varchar(200) NOT NULL
);

CREATE TABLE `profile_about` (
  `user_id` varchar(200) NOT NULL PRIMARY KEY,
  `about` mediumtext NOT NULL,
   FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `profile_skills` (
  `user_id` varchar(200) NOT NULL,
  `skill` varchar(50) NOT NULL,
    PRIMARY KEY(user_id, skill),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `profile_user_section` (
  `user_id` varchar(200) NOT NULL,
  `type` enum('experience','education','volunteering') NOT NULL,
  `title` varchar(200) NOT NULL,
  `location` mediumtext NOT NULL,
  `description` mediumtext NOT NULL,
  `startedAt` varchar(200) NOT NULL,
  `endedAt` varchar(200) DEFAULT NULL,
    PRIMARY KEY (user_id, type, title),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `force_logout` (
    user_id varchar(200) not null primary key,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    
CREATE TABLE `forgot_password` (
  user_id varchar(200) not null primary key,
  token varchar(200) not null unique,
  FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);