const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");



requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { status, toUserId } = req.params;
        const fromUserId = user._id;

        const toUserDetails = await User.findOne({
            _id: toUserId
        })

        //API validation start

        //#1
        const allowedStatus = ["interested", "ignored"];
        const isValidStatus = allowedStatus.includes(status);

        if (!isValidStatus) {
            throw new Error("Invalid request status");
        }

        //#2
        const isRequestExist = await ConnectionRequestModel.findOne({
            $or: [
                {
                    fromUser: fromUserId, toUser: toUserId
                },
                {
                    fromUser: toUserId,
                    toUser: fromUserId
                }
            ]
        });

        console.log("isRequestExist: ", isRequestExist);

        if (isRequestExist) {
            throw new Error("Connection request already exist");
        }

        //API validation end


        const connectionRequest = new ConnectionRequestModel({
            fromUser: fromUserId,
            toUser: toUserId,
            status
        });

        const data = await connectionRequest.save();

        const connectionMessage = (status === "interested") ?
            `${user.firstName}, you Successfully sent a Connection request to ${toUserDetails.firstName}.` :
            `${user.firstName}, you ignored to connect with  ${toUserDetails.firstName}`

        res.json({
            message: connectionMessage,
            data,
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }


});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const { status, requestId } = req.params;

        //API validation start

        // #1
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed" })
        }

        // #2
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUser: loggedInUser._id,
            status: "interested",
        })

        if (!connectionRequest) {
            res.status(404).json({
                message: "Connection request not found"
            })
        }
        //API validation end

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "connection request " + status,
            data,
        })
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
});

module.exports = requestRouter;