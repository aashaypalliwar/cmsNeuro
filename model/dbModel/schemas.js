module.exports.userSchema = {
  tableName: "users",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    designation TEXT,
    old_rank INTEGER,
    current_rank INTEGER,
    points INTEGER DEFAULT 0,
    tracking_points BIT DEFAULT 1,
    blacklisted BIT DEFAULT 0,
    timestamp INTEGER NOT NULL,
    password  TEXT NOT NULL,
    reset_token	TEXT,
    reset_token_expires_at INTEGER,
    bio TEXT`,
};

module.exports.topicSchema = {
  tableName: "topics",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    heading TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL,
    important BIT DEFAULT 0,
    isArchived BIT DEFAULT 0,
    archived_at INTEGER,
    timestamp INTEGER NOT NULL,
    updated_at INTEGER DEFAULT NULL`,
};

module.exports.taskSchema = {
  tableName: "tasks",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    heading TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL,
    important BIT DEFAULT 0,
    assignable BIT DEFAULT 1,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    deadline INTEGER NOT NULL,
    isArchived BIT DEFAULT 0,
    archived_at INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(topic_id) REFERENCES topics(id)
   `,
};

module.exports.tagSchema = {
  tableName: "tags",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    task_id INTEGER,
    FOREIGN KEY(task_id) REFERENCES tasks(id)`,
};

module.exports.commentSchema = {
  tableName: "comments",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(task_id) REFERENCES tasks(id)`,
};

module.exports.assignmentRequestSchema = {
  tableName: "assignmentRequests",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    reviewed BIT DEFAULT 0,
    accepted BIT DEFAULT 0,
    email TEXT NOT NULL,
    FOREIGN KEY(task_id) REFERENCES tasks(id),
    FOREIGN KEY(user_id) REFERENCES users(id)`,
};

module.exports.assignmentSchema = {
  tableName: "assignments",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    email TEXT NOT NULL,
    FOREIGN KEY(task_id) REFERENCES tasks(id),
    FOREIGN KEY(user_id) REFERENCES users(id)`,
};

module.exports.announcementSchema = {
  tableName: "announcements",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    lastEdit  INTEGER,
    isArchived INTEGER DEFAULT 0,
    archived_at INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)`,
};

module.exports.accessSchema = {
  tableName: "accesses",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(topic_id) REFERENCES topics(id),
    FOREIGN KEY(user_id) REFERENCES users(id)`,
};

module.exports.allotmentSchema = {
  tableName: "allotments",
  tableSchema: `id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    awarded_by INTEGER NOT NULL,
    awarded_at INTEGER NOT NULL,
    points_awarded INTEGER NOT NULL,
    reason TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(awarded_by) REFERENCES users(id)
    `,
};

//points      awarded_by      reason    Awarded at
//name email role designation currentrank currentpoints bio
