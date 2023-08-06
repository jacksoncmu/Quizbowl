# Choose "localhost 5" as your database
create database Quizbowl;
use Quizbowl;
CREATE TABLE room_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(6) NOT NULL,
    username VARCHAR(255) NOT NULL
);

select * from room_participants;

delete from room_participants;
