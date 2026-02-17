create database vivachat;


drop table if exists users, user_info, posts, post_likes, post_comments, comment_likes;
create table users (
  id SERIAL PRIMARY KEY,
	first_name varchar(30),
  last_name varchar(30),
  email varchar(50) UNIQUE,
  password varchar(200) NOT NULL,
  created_at TIMESTAMP NOT NULL default now()
);

create table user_info (
  user_id INT REFERENCES users(id),
  avatar_url VARCHAR(200),
  created_at TIMESTAMP NOT NULL default now()
);

create table posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  content VARCHAR (255),
  image_url VARCHAR (200),
  likes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL default now()
);


create table post_likes (
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id),
  created_at TIMESTAMP NOT NULL default now()
);

create table post_comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  likes INT NOT NULL DEFAULT 0,
  content TEXT NOT NULL CHECK (length(content) > 0),
  created_at TIMESTAMP NOT NULL default now()
);

create table comment_likes (
  comment_id INT NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, user_id),
  created_at TIMESTAMP NOT NULL default now()
);




CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS trigger AS $$
BEGIN
  UPDATE posts
  SET comments = comments + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_insert
AFTER INSERT ON post_comments
FOR EACH ROW
EXECUTE FUNCTION increment_post_comments();


CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS trigger AS $$
BEGIN
  UPDATE posts
  SET comments = comments - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_delete
AFTER DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION decrement_post_comments();



CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS trigger AS $$
BEGIN
  UPDATE posts
  SET likes = likes + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_like_insert
AFTER INSERT ON post_likes
FOR EACH ROW
EXECUTE FUNCTION increment_post_likes();


CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS trigger AS $$
BEGIN
  UPDATE posts
  SET likes = likes - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_like_delete
AFTER DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_post_likes();



CREATE OR REPLACE FUNCTION increment_comment_likes()
RETURNS trigger AS $$
BEGIN
  UPDATE post_comments
  SET likes = likes + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION increment_comment_likes();


CREATE OR REPLACE FUNCTION decrement_comments_likes()
RETURNS trigger AS $$
BEGIN
  UPDATE post_comments
  SET likes = likes - 1
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_comments_likes();

