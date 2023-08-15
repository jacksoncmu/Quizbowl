# Choose "localhost 5" as your database

CREATE TABLE room_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(6) NOT NULL,
    username VARCHAR(255) NOT NULL,
    identity VARCHAR(255) NOT NULL,
    has_buzzed_in TINYINT(1) DEFAULT 0
);

CREATE TABLE room_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(6) NOT NULL,
    status VARCHAR(255) NOT NULL
);


select * from room_participants;
select * from room_status;
delete from room_participants;
delete from room_status;
drop table room_participants;
drop table room_status;