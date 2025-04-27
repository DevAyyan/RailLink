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
    speed DECIMAL(3, 2) NOT NULL,
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
    cancelled_at TIMESTAMP NULL,
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



