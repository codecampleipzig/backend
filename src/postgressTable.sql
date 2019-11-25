CREATE TABLE projects (
	project_id serial NOT NULL PRIMARY KEY,
	project_title varchar NOT NULL,
	project_image_url varchar NOT NULL,
	project_description varchar NOT NULL,
	project_goal varchar NOT NULL,
	project_status varchar NOT NULL,
	project_creator integer NOT NULL,
	project_team integer [] NOT NULL,
	project_tasks integer [] NOT NULL
)

CREATE TABLE tasks (
	task_id serial NOT NULL PRIMARY KEY,
	task_title varchar NOT NULL,
	task_description varchar NOT NULL,
	task_status varchar NOT NULL,
	task_creator integer NOT NULL,
	task_init_date date NOT NULL,
	task_closed_by integer,
	task_closed_date date,
	task_delete_by integer,
	task_delete_date date,
	task_team integer [] NOT NULL,
	menu_section varchar NOT NULL
)

CREATE TABLE users (
	user_id serial NOT NULL PRIMARY KEY,
	user_name varchar NOT NULL,
	user_email varchar NOT NULL,
	password varchar NOT NULL,
	user_image_url varchar,
	join_date date NOT NULL,
	leave_date date
)

CREATE TABLE project_user (
	project_id integer REFERENCES projects,
	user_id integer REFERENCES users,
	PRIMARY KEY (user_id, project_id)
)

CREATE TABLE task_user (
	task_id integer REFERENCES tasks,
	user_id integer REFERENCES users,
	PRIMARY KEY (user_id, task_id)
)



INSERT INTO projects (project_title, project_image_url, project_description, project_goal, project_status, project_creator, project_team, project_tasks)
VALUES ('Plan the graduation', './../assets/project-default.png', 'Plan the gradtuation party for the first code campers leipzig. Book amazing DJS and food and drinks that makes everyone happy. Also have a very nice venue and lets have the best evening ever!!!', 'Plan the best Party ever', 'open', '12', '{2, 3, 6, 8, 9, 10, 12}', '{1, 2, 3}')

INSERT INTO projects (project_title, project_image_url, project_description, project_goal, project_status, project_creator, project_team, project_tasks)
VALUES ('Plan the graduation trip', './../assets/project-default.png', 'plan the gradutaion trrip to napoli. book a wonderful beautiful house close to the sea, than plan what food you are going to eat, and plan what prosecco you are going to drink. also bring fun games and makeup', 'make the best trip ever', 'open', '9', '{6, 7, 8, 9, 11}', '{4, 5}')

INSERT INTO projects (project_title, project_image_url, project_description, project_goal, project_status, project_creator, project_team, project_tasks)
VALUES ('Code Camp Leipzig', './../assets/project-default.png', 'teach 13 amazing interesting and wonderful people how to become realdevelopers. First teach them everything about the frontend. The html and css and js and ts and the ts and the angular. Then confuse them with travis and later teach them postgres which is fun! Shwo them how they conect it to each other and you are done. Of course also teach them how to work together with scrum. Cool ready go.', 'get 13 developer', 'done', '13', '{14, 15, 16, 17, 18, 19}', '{6, 7}')

INSERT INTO tasks (task_title, task_description, task_status, task_creator, task_init_date, task_team, menu_section)
VALUES ('Get Djs', 'ask Mariana and Lena to dj', 'open', '6', current_date, '{2, 3, 6}', 'starter')

INSERT INTO task (task_title, task_description, task_status, task_creator, task_init_date, task_closed_by, task_closed_date, task_team, menu_section)
VALUES ('Order Champagen', 'make everyone happy. and ask Lena where to find the best Champagen in town', 'closed', '12', current_date, '12', current_date, '{2, 12}', 'starter')

INSERT INTO tasks (task_title, task_description, task_status, task_creator, task_init_date, task_team, menu_section)
VALUES ('Buy a lot of Burger', 'ake everyone very happy. buy the best burger in town, but ask Gabe where to find them, because he knows', 'open', '7', current_date, '{8, 9,10}', 'starter')

INSERT INTO tasks (task_title, task_description, task_status, task_creator, task_init_date, task_delete_by, task_delete_date, task_team, menu_section)
VALUES ('Book the flight', 'look or the cheapest flights', 'delete', '9', current_date, '8', current_date, '{6, 7, 8}', 'starter')

INSERT INTO tasks (task_title, task_description, task_status, task_creator, task_init_date, task_team, menu_section)
VALUES ('Plan food', 'go through the most delicios receipts and look at all the picture and be excited for the food', 'open', '11', current_date, '{9, 11}', 'starter')

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Mautzi', 'MolleMorallo@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Mariana', 'BringMarianaBananaToSchool@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Lena', 'lenintheempress@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Björn', 'thPObutNotTheRiver@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Pauline', 'DelphineQueen@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Nick', 'nickTheSwan@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Nico', 'intelligentButBeautiful@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Simona', 'deepBeutifulSea@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Beatriz', 'womanWhoRockTheWorld@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Anahita', 'bestBiologistInTheWorld@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Kaab', 'theCricketEnthusiast@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Andres', 'krawalloAndi@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Iko', 'caretaker3000@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Taylor', 'sendMeJapaneseSweets@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Gabe', 'teacherestOfThemAll@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Franz', 'dontForgtTheHeap@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Simon', 'paparrazzo8000@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Valeria', 'iDesignYourBeautifulWebsite@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO users (user_name, user_email, user_image_url, join_date)
VALUES ('Dan', 'theDarkPrince@gmail.com', '../assets/user_avatar.png', current_date)

INSERT INTO project_user (user_id,project_id)
SELECT user_id,project_id
FROM users U, projects P
WHERE U.user_id  = ANY (P.project_team)

INSERT INTO task_user (user_id,task_id)
SELECT user_id,task_id
FROM users U, task T
WHERE U.user_id  = ANY (T.task_team)

