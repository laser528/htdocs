# Tables for application.

create table users (user_id varchar(200) not null PRIMARY key,
                    username varchar(200) not null unique,
                    email varchar(200) not null unique,
                    password varchar(200) not null,
                    salt varchar(200) not null,
                    views int(10) not null,
                    type ENUM('inner', 'staff', 'administrator') not null,
                    url varchar(200) not null unique,
                    cover_photo_location varchar(200) null,
                    createdAt int(10) not null,
                    updatedAt int(10) not null
                   );
                   
create table profile_about (
    user_id varchar(200) not null primary key,
    about text not null,
    FOREIGN KEY(user_id) references users(user_id) on delete cascade on update cascade
    );
    
create table profile_skills (
    user_id varchar(200) not null,
    skill varchar(50) not null,
    PRIMARY KEY(user_id, skill),
    FOREIGN KEY(user_id) references users(user_id) on delete cascade on update cascade
    );
    
create table profile_user_section (
    user_id varchar(200) not null,
    type ENUM('experience','education','volunteering'),
    title varchar(200) not null,
    location text not null,
    description text not null,
    startedAt int(10) not null,
    endedAt int(10),
    PRIMARY KEY(user_id, type, title),
    FOREIGN KEY(user_id) references users(user_id) on delete cascade on update cascade
    );
    
create table opportunities(
    opportunity_id varchar(200) not null primary key,
    creator_id varchar(200) not null,
    title text not null,
    contents text not null,
    views int(10) not null,
    createdAt int(10) not null,
    updatedAt int(10) not null
    );
    
 create table connections(
     user_id varchar(200) not null,
     connection_id varchar(200) not null,
     PRIMARY KEY(user_id, connection_id),
     FOREIGN KEY(user_id) REFERENCES users(user_id) on delete cascade on update cascade,
     FOREIGN KEY(connection_id) REFERENCES users(user_id) on delete cascade on update cascade
     );