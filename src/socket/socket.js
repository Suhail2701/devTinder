const socket = require("socket.io");
const Chat = require("../models/chat");
const initializeSocketServer = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    io.on("connection", (socket) => {
        //handle events here
        socket.on("joinChat", ({ loggedInUserId, targetId }) => {

            const roomId = [loggedInUserId, targetId].sort().join("_");
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({
            firstName,
            newMessage,
            targetId,
            loggedInUserId,
            photoUrl
        }) => {
            try {
                const roomId = [loggedInUserId, targetId].sort().join("_");
                console.log(firstName + " " + newMessage);

                //here we are saving the messages in DB

                let messages = await Chat.findOne({
                    participants: { $all: [loggedInUserId, targetId] }
                });

                if (!messages) {
                    messages = new Chat({
                        participants: [loggedInUserId, targetId],
                        messages: []
                    });

                }

                messages.messages.push({
                    senderId: loggedInUserId,
                    message: newMessage
                });

                await messages.save();

                io.to(roomId).emit("receivedMessage", {
                    firstName,
                    newMessage,
                    photoUrl,
                    loggedInUserId
                });
            }
            catch (err) {
                console.error("Error: ", err.message);
            }
        });

        socket.on("disconnect", () => { })

    })
}
module.exports = initializeSocketServer;