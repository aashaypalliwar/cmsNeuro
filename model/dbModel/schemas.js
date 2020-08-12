module.exports.userSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
role TEXT NOT NULL,
designation TEXT NOT NULL,
old_rank INTEGER,
current_rank INTEGER,
points INTEGER DEFAULT 0,
tracking_points BIT DEFAULT 1,
blacklisted BIT DEFAULT 0,
timestamp TEXT NOT NULL,
password  TEXT NOT NULL,
reset_token	TEXT,
bio TEXT`;

module.exports.topicSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
heading TEXT NOT NULL,
description TEXT,
scope TEXT NOT NULL,
reviewed BIT DEFAULT 0`;

module.exports.taskSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
heading TEXT NOT NULL,
description TEXT,
scope TEXT NOT NULL,
reviewed BIT DEFAULT 0,
assignable BIT DEFAULT 1,
user_id INTEGER NOT NULL,
topic_id INTEGER NOT NULL,
deadline TEXT NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id),
FOREIGN KEY(topic_id) REFERENCES topics(id)`;

module.exports.tagSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
tag TEXT NOT NULL,
timestamp TEXT NOT NULL,
task_id INTEGER,
FOREIGN KEY(task_id) REFERENCES tasks(id)`;

module.exports.commentSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL,
timestamp TEXT NOT NULL,
user_id INTEGER NOT NULL,
task_id INTEGER NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id),
FOREIGN KEY(task_id) REFERENCES tasks(id)`;

module.exports.assignmentRequestSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
task_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
timestamp TEXT NOT NULL,
reviewed BIT DEFAULT 0,
accepted BIT DEFAULT 0,
FOREIGN KEY(task_id) REFERENCES tasks(id),
FOREIGN KEY(user_id) REFERENCES users(id)`;

module.exports.assignmentSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
task_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
timestamp TEXT NOT NULL,
FOREIGN KEY(task_id) REFERENCES tasks(id),
FOREIGN KEY(user_id) REFERENCES users(id)
`;

module.exports.announcementSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
body TEXT NOT NULL,
timestamp INTEGER NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id)
`;

module.exports.accessSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
topic_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
FOREIGN KEY(topic_id) REFERENCES topics(id),
FOREIGN KEY(user_id) REFERENCES users(id)`;

module.exports.allotmentSchema = `id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
timestamp INTEGER NOT NULL,
points INTEGER NOT NULL,
reason TEXT NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id)
`;
