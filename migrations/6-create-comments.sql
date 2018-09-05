CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  posts_id INTEGER,
  user_id INTEGER,
  content TEXT,
  score INTEGER,
  FOREIGN KEY (posts_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
