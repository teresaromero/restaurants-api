--- sqlite3 restaurants.db ".schema" > schema.sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    neighborhood TEXT,
    photograph TEXT,
    address TEXT,
    lat REAL,
    lng REAL,
    image TEXT,
    cuisine_type TEXT
);
CREATE TABLE operating_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    day TEXT,
    hours TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);
--- CREATE TABLE sqlite_sequence(name, seq);
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comments TEXT,
    date DATETIME, -- noqa
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE TABLE favorites (
    user_id INTEGER,
    restaurant_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);
