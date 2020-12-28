module.exports.userSchema = {
  tableName: "users",
  tableSchema: `id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    designation TEXT,
    old_rank INTEGER,
    current_rank INTEGER,
    points INTEGER DEFAULT 0,
    tracking_points INTEGER DEFAULT 1,
    blacklisted INTEGER DEFAULT 0,
    timestamp BIGINT NOT NULL,
    password  TEXT NOT NULL,
    reset_token	TEXT,
    reset_token_expires_at BIGINT,
    bio TEXT`,
};

module.exports.topicSchema = {
  tableName: "topics",
  tableSchema: `id SERIAL PRIMARY KEY,
    heading TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL,
    important INTEGER DEFAULT 0,
    isArchived INTEGER DEFAULT 0,
    archived_at BIGINT,
    timestamp BIGINT NOT NULL,
    updated_at BIGINT DEFAULT NULL`,
};

module.exports.taskSchema = {
  tableName: "tasks",
  tableSchema: `id SERIAL PRIMARY KEY,
    heading TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL,
    important INTEGER DEFAULT 0,
    assignable INTEGER DEFAULT 1,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    deadline BIGINT NOT NULL,
    isArchived INTEGER DEFAULT 0,
    archived_at BIGINT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT tk_tasks FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
   `,
};

module.exports.tagSchema = {
  tableName: "tags",
  tableSchema: `id SERIAL PRIMARY KEY,
    tag TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    task_id INTEGER,
    CONSTRAINT tk_tags FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE`,
};

module.exports.commentSchema = {
  tableName: "comments",
  tableSchema: `id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT tk_comments FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE`,
};

module.exports.assignmentRequestSchema = {
  tableName: "assignmentRequests",
  tableSchema: `id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timestamp BIGINT NOT NULL,
    reviewed INTEGER DEFAULT 0,
    accepted INTEGER DEFAULT 0,
    email TEXT NOT NULL,
    CONSTRAINT tk_assignmentReq FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT uk_assignmentReq FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE`,
};

module.exports.assignmentSchema = {
  tableName: "assignments",
  tableSchema: `id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timestamp BIGINT NOT NULL,
    email TEXT NOT NULL,
    CONSTRAINT tk_assignments FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT uk_assignments FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE`,
};

module.exports.announcementSchema = {
  tableName: "announcements",
  tableSchema: `id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    lastEdit  INTEGER,
    isArchived INTEGER DEFAULT 0,
    archived_at BIGINT,
    FOREIGN KEY(user_id) REFERENCES users(id)`,
};

module.exports.accessSchema = {
  tableName: "accesses",
  tableSchema: `id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT tk_access FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT uk_access FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE`,
};

module.exports.allotmentSchema = {
  tableName: "allotments",
  tableSchema: `id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    awarded_by INTEGER NOT NULL,
    awarded_at BIGINT NOT NULL,
    points_awarded INTEGER NOT NULL,
    reason TEXT NOT NULL,
    CONSTRAINT uk_allotments FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(awarded_by) REFERENCES users(id)
    `,
};

//points      awarded_by      reason    Awarded at
//name email role designation currentrank currentpoints bio
