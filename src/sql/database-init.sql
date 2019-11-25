CREATE TABLE IF NOT EXISTS users (
	user_id serial NOT NULL PRIMARY KEY,
	user_name varchar NOT NULL UNIQUE,
	user_email varchar NOT NULL,
	password varchar NOT NULL,
	user_image_url varchar,
	join_date timestamp NOT NULL DEFAULT NOW(),
	leave_date timestamp
);

CREATE TABLE IF NOT EXISTS projects (
	project_id serial NOT NULL PRIMARY KEY,
	project_title varchar NOT NULL UNIQUE,
	project_image_url varchar NOT NULL,
	project_description varchar NOT NULL,
	project_goal varchar NOT NULL,
	project_status varchar NOT NULL DEFAULT 'open',
	project_creator integer REFERENCES users(user_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
	task_id serial NOT NULL PRIMARY KEY,
  project_id integer REFERENCES projects(project_id) NOT NULL,
	task_title varchar NOT NULL,
	task_description varchar,
	task_status varchar NOT NULL,
	task_creator integer REFERENCES users(user_id) NOT NULL,
	task_init_date timestamp NOT NULL DEFAULT NOW(),
	task_closed_by integer REFERENCES users(user_id),
  task_closed_date timestamp,
	task_deleted_by integer,
	task_deleted_date timestamp,
	menu_section varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS user_task (
	user_id integer REFERENCES users(user_id) NOT NULL,
	task_id integer REFERENCES tasks(task_id) NOT NULL,
  PRIMARY KEY NOT NULL(user_id, task_id)
);

CREATE TABLE IF NOT EXISTS user_project (
	user_id integer REFERENCES users(user_id) NOT NULL,
	project_id integer REFERENCES projects(project_id) NOT NULL,
  PRIMARY KEY NOT NULL(user_id, project_id)
);