CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'station_master', 'member', 'guest') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    tier ENUM('Economy', 'Business', 'VIP') NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL
);

CREATE TABLE railways (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_1_id INT NOT NULL,
    station_2_id INT NOT NULL,
    distance_km DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (station_1_id) REFERENCES stations(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (station_2_id) REFERENCES stations(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    eco_max INT NOT NULL,
    bus_max INT NOT NULL,
    vip_max INT NOT NULL,
    speed DECIMAL(5, 2) NOT NULL,
    type ENUM('Metro', 'Intercity') NOT NULL
);

CREATE TABLE train_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    railway_id INT NOT NULL,
    sequence_number INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (railway_id) REFERENCES railways(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    dep_station_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_station_id INT NOT NULL,
    arrival_time DATETIME NOT NULL,
    status ENUM('On Time', 'Delayed', 'Cancelled') DEFAULT 'On Time',
    eco_price DECIMAL(10, 2) DEFAULT 0,
    bus_price DECIMAL(10, 2) DEFAULT 0,
	vip_price DECIMAL(10, 2) DEFAULT 0,
    eco_left int,
    bus_left int,
    vip_left int,
    FOREIGN KEY (train_id) REFERENCES trains(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (dep_station_id) REFERENCES stations(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
	FOREIGN KEY (arrival_station_id) REFERENCES stations(id) 
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    class ENUM('economy', 'business', 'vip') NOT NULL,
    status ENUM('Booked', 'Cancelled', 'Completed') DEFAULT 'Booked',
    cancelled_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);



-- Insert into users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'adminpass', 'admin'),
('John Doe', 'john@example.com', 'password123', 'member'),
('Alice Smith', 'alice@example.com', 'password123', 'station_master'),
('Bob Johnson', 'bob@example.com', 'password123', 'guest'),
('Emily Davis', 'emily@example.com', 'password123', 'member'),
('Chris Brown', 'chris@example.com', 'password123', 'guest'),
('Sarah Wilson', 'sarah@example.com', 'password123', 'station_master'),
('Mike Taylor', 'mike@example.com', 'password123', 'member'),
('Jessica Lee', 'jessica@example.com', 'password123', 'guest'),
('Daniel White', 'daniel@example.com', 'password123', 'member'),
('Sophia Green', 'sophia@example.com', 'password123', 'guest');

-- Insert into memberships
INSERT INTO memberships (user_id, tier, expiry_date) VALUES
(2, 'Economy', '2026-05-01'),
(3, 'Business', '2025-12-31'),
(4, 'VIP', '2025-09-15'),
(5, 'Economy', '2025-11-20'),
(6, 'Business', '2026-01-10'),
(7, 'VIP', '2025-08-08'),
(8, 'Economy', '2025-07-22'),
(9, 'Business', '2026-02-17'),
(10, 'VIP', '2025-10-10'),
(11, 'Economy', '2025-12-05');

-- Insert into stations
INSERT INTO stations (name, city, latitude, longitude) VALUES
('Central Station', 'New York', 40.712776, -74.005974),
('North Station', 'Boston', 42.365291, -71.061667),
('West Station', 'Chicago', 41.878113, -87.629799),
('East Station', 'Philadelphia', 39.952583, -75.165222),
('South Station', 'Miami', 25.761681, -80.191788),
('Lake Station', 'Cleveland', 41.499321, -81.694359),
('River Station', 'Pittsburgh', 40.440625, -79.995888),
('Bay Station', 'San Francisco', 37.774929, -122.419418),
('Harbor Station', 'Los Angeles', 34.052235, -118.243683),
('Hill Station', 'Denver', 39.739235, -104.990250),
('Plains Station', 'Dallas', 32.776665, -96.796989);

-- Insert into railways
INSERT INTO railways (station_1_id, station_2_id, distance_km) VALUES
(1, 2, 320.50),
(2, 3, 950.75),
(3, 4, 450.00),
(4, 5, 1700.30),
(5, 6, 2100.20),
(6, 7, 300.00),
(7, 8, 2300.60),
(8, 9, 600.40),
(9, 10, 1400.00),
(10, 11, 1300.25),
(1, 11, 1800.00);

-- Insert into trains
INSERT INTO trains (name, eco_max, bus_max, vip_max, speed, type) VALUES
('Express Line', 300, 100, 50, 2.50, 'Intercity'),
('City Metro', 200, 80, 40, 1.20, 'Metro'),
('Rapid Transit', 250, 90, 45, 2.00, 'Metro'),
('Interstate Train', 400, 150, 60, 2.80, 'Intercity'),
('Coastal Line', 350, 120, 55, 2.60, 'Intercity'),
('Mountain Line', 280, 110, 40, 2.40, 'Intercity'),
('Sunset Metro', 220, 85, 35, 1.50, 'Metro'),
('Northern Express', 310, 95, 50, 2.70, 'Intercity'),
('Urban Shuttle', 180, 70, 30, 1.10, 'Metro'),
('Southern Line', 330, 115, 48, 2.55, 'Intercity'),
('Western Metro', 190, 75, 33, 1.30, 'Metro');

-- Insert into train_routes
INSERT INTO train_routes (train_id, railway_id, sequence_number) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(2, 4, 2),
(3, 5, 1),
(4, 6, 1),
(5, 7, 1),
(6, 8, 1),
(7, 9, 1),
(8, 10, 1),
(9, 11, 1);

-- Insert into schedules
INSERT INTO schedules (train_id, dep_station_id, departure_time, arrival_station_id, arrival_time, eco_price, bus_price, vip_price, eco_left, bus_left, vip_left) VALUES
(1, 1, '2025-04-29 08:00:00', 2, '2025-04-29 11:00:00', 50.00, 100.00, 150.00, 300, 100, 50),
(2, 2, '2025-04-29 09:00:00', 3, '2025-04-29 12:00:00', 45.00, 90.00, 140.00, 200, 80, 40),
(3, 3, '2025-04-29 10:00:00', 4, '2025-04-29 13:00:00', 40.00, 85.00, 130.00, 250, 90, 45),
(4, 4, '2025-04-29 07:30:00', 5, '2025-04-29 10:30:00', 55.00, 110.00, 160.00, 400, 150, 60),
(5, 5, '2025-04-29 11:00:00', 6, '2025-04-29 14:00:00', 52.00, 105.00, 155.00, 350, 120, 55),
(6, 6, '2025-04-29 12:30:00', 7, '2025-04-29 15:30:00', 48.00, 95.00, 145.00, 280, 110, 40),
(7, 7, '2025-04-29 14:00:00', 8, '2025-04-29 17:00:00', 46.00, 92.00, 142.00, 220, 85, 35),
(8, 8, '2025-04-29 15:30:00', 9, '2025-04-29 18:30:00', 53.00, 107.00, 157.00, 310, 95, 50),
(9, 9, '2025-04-29 17:00:00', 10, '2025-04-29 20:00:00', 41.00, 87.00, 137.00, 180, 70, 30),
(10, 10, '2025-04-29 18:30:00', 11, '2025-04-29 21:30:00', 49.00, 98.00, 148.00, 330, 115, 48),
(11, 11, '2025-04-29 19:30:00', 1, '2025-04-29 22:30:00', 44.00, 89.00, 139.00, 190, 75, 33);

-- Insert into tickets
INSERT INTO tickets (user_id, schedule_id, class) VALUES
(2, 1, 'economy'),
(3, 2, 'business'),
(4, 3, 'vip'),
(5, 4, 'economy'),
(6, 5, 'business'),
(7, 6, 'vip'),
(8, 7, 'economy'),
(9, 8, 'business'),
(10, 9, 'vip'),
(11, 10, 'economy'),
(2, 11, 'business');

-- Insert into payments
INSERT INTO payments (user_id, ticket_id, amount, payment_status, transaction_id) VALUES
(2, 1, 50.00, 'Completed', 'TXN1001'),
(3, 2, 90.00, 'Completed', 'TXN1002'),
(4, 3, 130.00, 'Pending', 'TXN1003'),
(5, 4, 50.00, 'Completed', 'TXN1004'),
(6, 5, 105.00, 'Completed', 'TXN1005'),
(7, 6, 145.00, 'Failed', 'TXN1006'),
(8, 7, 50.00, 'Completed', 'TXN1007'),
(9, 8, 92.00, 'Pending', 'TXN1008'),
(10, 9, 137.00, 'Completed', 'TXN1009'),
(11, 10, 49.00, 'Completed', 'TXN1010'),
(2, 11, 89.00, 'Completed', 'TXN1011');
