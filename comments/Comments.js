const socketio = require("socket.io");
const db = require("../model/dbModel/database");

module.exports.setupSocket = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    socket.on("join", async (room) => {
      socket.join(room);
      io.emit("roomJoined", room);
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
