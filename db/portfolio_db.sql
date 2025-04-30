create database portfolio_db;
use portfolio_db;
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT(20) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45));
desc contact_messages;