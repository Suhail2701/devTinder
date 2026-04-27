const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { targetId } = req.params;
        const userId = loggedInUser._id;
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetId] }
        }).populate({
            path:"messages.senderId",
            select: "firstName lastName photoUrl"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetId],
                messages: []
            })
            await chat.save();
        }
        res.json(chat);
    }
    catch (err) {
        res.status(400).send("ERROR: ", err);
        console.log(err);
    }
})

module.exports = chatRouter;

