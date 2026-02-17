insert into users (first_name, last_name, email, password)
values 
('Firmando', 'Kojol', 'a@a.com', '$2b$10$AgzzEzbmmvEcP7atpnibsusu/9H9puXBXQf63eFA2umZk1fXirPRO'),
('Juan', 'Hernandez', 'b@b.com', '$2b$10$AgzzEzbmmvEcP7atpnibsusu/9H9puXBXQf63eFA2umZk1fXirPRO'),
('Michael', 'Doe', 'c@c.com', '$2b$10$AgzzEzbmmvEcP7atpnibsusu/9H9puXBXQf63eFA2umZk1fXirPRO'),
('Jane', 'Smith', 'd@d.com', '$2b$10$AgzzEzbmmvEcP7atpnibsusu/9H9puXBXQf63eFA2umZk1fXirPRO'),
('Alice', 'Johnson', 'e@e.com', '$2b$10$AgzzEzbmmvEcP7atpnibsusu/9H9puXBXQf63eFA2umZk1fXirPRO');

insert into posts (user_id, content, image_url, likes, comments)
values
(
    1,
'Esto es un post de prueba HHHHHHHHHHHH.',
'https://picsum.photos/id/236/300/200',
129,
4011
),
(
    2,
'Este es otro post de prueba KOPKOPKOP.',
'https://picsum.photos/id/136/300/200',
256,
512
),
(
    3,
'Este es un tercer post de prueba KEKEKEKE.',
'https://picsum.photos/id/436/300/200',
512,
1024
); 

insert INTO user_info (user_id, avatar_url)
VALUES
(1, 'https://randomuser.me/api/portraits/men/1.jpg'),
(2, 'https://randomuser.me/api/portraits/women/2.jpg'),
(3, 'https://randomuser.me/api/portraits/men/3.jpg');


INSERT INTO post_likes (post_id, user_id) VALUES
(1, 1),
(1, 2),
(1, 3),

(2, 1),
(2, 2),

(3, 2),
(3, 3),
(4, 2),

(4, 1);

INSERT INTO post_comments (post_id, user_id, content) VALUES
(1, 2, 'This is fire 🔥'),
(1, 3, 'Love this post!'),
(1, 2, 'Totally agree with you'),

(2, 1, 'Interesting take 🤔'),
(2, 3, 'Could you explain more?'),

(3, 2, 'HAHA this made my day 😂'),
(3, 1, 'So true'),

(4, 1, 'Clean work 👏'),

(5, 3, 'Where was this taken?'),
(5, 2, 'Nice shot 📸');
