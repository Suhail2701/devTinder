const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendResetEmail = require("../utils/index");



profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {

        const user = req.user;
        if (!user) {
            throw new Error("user does not exist");
        }
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {

        const isAllowed = validateEditProfileData(req);
        if (!isAllowed) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;
        console.log("loggedInUser: ", loggedInUser);
        const data = Object.keys(req.body).forEach((e) => loggedInUser[e] = req.body[e]);

        console.log("data: ", data);
        // await User.findOneAndUpdate({_id:loggedInUser._id}, loggedInUser);
        // or
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your prifile is updated successfull`,
            data: loggedInUser
        });

    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.post("/profile/forget-password", async (req, res) => {
    try {
        const enteredMailId = req.body.emailId;

        const user = await User.findOne({ emailId: enteredMailId });

        if (!user) {
            return res.json({
                message: "If this email exists, a reset link has been sent",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        console.log("token for reset:: ", token);

        const hashedToken = await bcrypt.hash(token, 10);

        await User.findOneAndUpdate({
            emailId: enteredMailId
        }, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: Date.now() + 1000 * 60 * 10,

        });

        sendResetEmail(enteredMailId, token);

        res.json({
            message: "If this email exists, a reset link has been sent",
        });


    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/reset-password", async (req, res) => {
    try {
        const userEnterdPassword = req.body.password;
        const userEnteredEmailId = req.body.emailId;
        const rawToken = req.query.token;

        console.log("rawToken for reset: ", rawToken);
        const user = await User.findOne({ emailId: userEnteredEmailId });

        const hashedToken = user.resetPasswordToken;

        const isValidToken = await bcrypt.compare(rawToken, hashedToken);

        if(!isValidToken)
        {
            throw new Error("Invalid Request!!!");
        }

        const newHashedPassword = await bcrypt.hash(userEnterdPassword, 10);


        await User.findOneAndUpdate({emailId:userEnteredEmailId},{
            password:newHashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        res.json({
            message:"Password Updated Sucessfully",
        })

    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

})


module.exports = profileRouter;