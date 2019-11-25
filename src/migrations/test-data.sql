INSERT INTO users (user_name, user_email, user_image_url, password)
VALUES ('Mautzi', 'MolleMorallo@gmail.com', '', '!.Ba1234:!'),
('Mariana', 'BringMarianaBananaToSchool@gmail.com', '', '!.Ba1234:!'),
('Lena', 'lenintheempress@gmail.com', '', '!.Ba1234:!'),
('Björn', 'thPObutNotTheRiver@gmail.com', '', '!.Ba1234:!'),
('Pauline', 'DelphineQueen@gmail.com', '', '!.Ba1234:!'),
('Nick', 'nickTheSwan@gmail.com', '', '!.Ba1234:!'),
('Nico', 'intelligentButBeautiful@gmail.com', '', '!.Ba1234:!'),
('Simona', 'deepBeutifulSea@gmail.com', '', '!.Ba1234:!'),
('Beatriz', 'womanWhoRockTheWorld@gmail.com', '', '!.Ba1234:!'),
('Anahita', 'bestBiologistInTheWorld@gmail.com', '', '!.Ba1234:!'),
('Kaab', 'theCricketEnthusiast@gmail.com', '', '!.Ba1234:!'),
('Andres', 'krawalloAndi@gmail.com', '', '!.Ba1234:!'),
('Iko', 'caretaker3000@gmail.com', '', '!.Ba1234:!'),
('Taylor', 'sendMeJapaneseSweets@gmail.com', '', '!.Ba1234:!'),
('Gabe', 'teacherestOfThemAll@gmail.com', '', '!.Ba1234:!'),
('Franz', 'dontForgtTheHeap@gmail.com', '', '!.Ba1234:!'),
('Simon', 'paparrazzo8000@gmail.com', '', '!.Ba1234:!'),
('Valeria', 'iDesignYourBeautifulWebsite@gmail.com', '', '!.Ba1234:!')
('Dan', 'theDarkPrince@gmail.com', '', '!.Ba1234:!')

INSERT INTO projects (project_title, project_image_url, project_description, project_goal, project_status, project_creator)
VALUES 
('Plan the graduation', '', 'Plan the gradtuation party for the first code campers leipzig. Book amazing DJS and food and drinks that makes everyone happy. Also have a very nice venue and lets have the best evening ever!!!', 'Plan the best Party ever', 'open', 1),
('Plan the graduation trip', '', 'Plan the gradutaion trip to Napoli. book a wonderful beautiful house close to the sea, than plan what food you are going to eat, and plan what prosecco you are going to drink. also bring fun games and makeup', 'Make the best trip ever', 'open', 9),
('Code Camp Leipzig', '', 'Teach 13 amazing interesting and wonderful people how to become realdevelopers. First teach them everything about the frontend. The html and css and js and ts and the ts and the angular. Then confuse them with travis and later teach them postgres which is fun! Shwo them how they conect it to each other and you are done. Of course also teach them how to work together with scrum. Cool ready go.', 'Get 13 developer', 'done', 14)


INSERT INTO tasks (project_id, task_title, task_description, task_status, task_creator, menu_section)
VALUES (1, 'Get Djs', 'ask Mariana and Lena to dj', 'open', 1, 'starter'),
(1, 'Order Champagne', 'make everyone happy. and ask Lena where to find the best Champagen in town', 'closed', 12,  'starter'),
(1, 'Buy a lot of Burger', 'ake everyone very happy. buy the best burger in town, but ask Gabe where to find them, because he knows', 'open', 7, 'starter'),
(2, 'Book the flight', 'look or the cheapest flights', 'delete', '9', 'starter'),
(2, 'Plan food', 'go through the most delicios receipts and look at all the picture and be excited for the food', 'open', 11, 'starter')


INSERT INTO user_project (user_id, project_id)
VALUES (1, 1),
(2, 1),
(6, 1),
(3, 1),
(8, 1),
(9, 1),
(10, 1),
(12, 1),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(13, 2),
(11, 2),
(14, 3),
(15, 3),
(16, 3),
(17, 3),
(18, 3),
(19, 3)


INSERT INTO user_task (user_id, task_id)
VALUES (2,1),
(3, 1),
(1, 2),
(2, 2),
(4, 3),
(5, 3),
(9, 3),
(10, 3),
(6, 4),
(7, 4),
(8, 4),
(9, 5),
(11, 5),
(12, 5)

