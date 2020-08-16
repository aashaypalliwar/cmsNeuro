const socketio = require("socket.io");
const db = require("../model/dbModel/database");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { JWT_SECRET } = require("../utils/config");

module.exports.setupSocket = (server) => {
  const io = socketio(server);

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
        if (err) throw new AppError("Authentication error", 400);
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new AppError("Authentication error", 400));
    }
  }).on("connection", (socket) => {
    // Connection now authenticated to receive further events
    socket.on("join", async (room) => {
      socket.join(room);
      io.emit("roomJoined", room); //optional----can be used if required
    });

    socket.on("message", async (data) => {
      const { taskId, authorId, comment } = data;
      const timestamp = Date.now();
      const queryParms = [comment, timestamp, authorId, taskId];
      const newComment = await db.query(
        `INSERT INTO comments (text,timestamp,user_id,task_id) VALUES (?,?,?,?)`,
        queryParms
      );
      io.in(taskId).emit("newComment", newComment); //for now, roomName=taskId
    });
  });
};

// Authentication done
// Sender: admin/superadmin/member emit info on message -> {sender, comment, taskid}
// cache :
// if scope of task is there stored on cache, use that for comparison. else query the db
// and store in cache.
// Cache stores: task scope -> task_id : { scope: scope, assigned: [] }
// check scope of sender === scope of task (query) ? if scope is private, task's scope has senderID?
// if good to go, store the comment in db
// emitters: superadmin, admin, member {task info, comment}
// frontend of a user will have role based listeners, and frontend will have ids of the users' private
// tasks. eg 202, 208, 110 is taskID then fe will to all these 3. listen
// backend: io.emit(taskid.toString(), comment); this will be if it is private and everything is ok
