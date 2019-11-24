INSERT INTO users (user_name, user_email, user_image_url, password)
VALUES ('Mautzi', 'MolleMorallo@gmail.com', '', '12345');

INSERT INTO projects (project_title, project_image_url, project_description, project_goal, project_status, project_creator)
VALUES ('Plan the graduation', '', 'Plan the gradtuation party for the first code campers leipzig. Book amazing DJS and food and drinks that makes everyone happy. Also have a very nice venue and lets have the best evening ever!!!', 'Plan the best Party ever', 'open', 1);

INSERT INTO tasks (project_id, task_title, task_description, task_status, task_creator, menu_section)
VALUES (1, 'Get Djs', 'ask Mariana and Lena to dj', 'open', 1, 'starter');
