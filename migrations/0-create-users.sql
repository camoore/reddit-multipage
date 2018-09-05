CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  cryptedPassword TEXT,
  salt TEXT
);
