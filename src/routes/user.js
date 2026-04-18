const express = require("express");

const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const requests = await ConnectionRequestModel.find({
            toUser: loggedInUser._id,
            status: "interested",
        }).populate("fromUser", "firstName lastName about photoUrl");

        res.json({
            message: "Data fetched successfully",
            data: requests
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUser: loggedInUser._id, status: "accepted" },
                { toUser: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUser", "firstName lastName photoUrl about")
            .populate("toUser", "firstName lastName photoUrl about");

        const data = connections.map((con) => {
            if (loggedInUser._id.equals(con.fromUser._id)) {
                return con.toUser;
            }
            return con.fromUser;
        })

        res.json({
            data,
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});


userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {

        // extracting pagination values start

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 100;
        const skip = (page-1)*limit;

        limit = limit > 50? 50:limit;

        // extracting pagination values end

        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUser:loggedInUser._id},
                { toUser: loggedInUser._id}
            ]
        }).select("fromUser toUser").populate("fromUser", "firstName lastName gender age about photoUrl")
        .populate("toUser", "firstName lastName gender age about photoUrl");

        const hideUsersFromFeed = new Set();

        connections.map((con)=>{
            hideUsersFromFeed.add(con.fromUser._id);
            hideUsersFromFeed.add(con.toUser._id);
        });

        console.log("set: ", hideUsersFromFeed);

        const feedCards = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUsersFromFeed)}},
                {_id:{$ne: loggedInUser._id}}
            ]
        }).select("firstName lastName gender age about skills photoUrl")
        .skip(skip)
        .limit(limit);


        res.json({
            data: feedCards,
            total:feedCards.length
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = userRouter;