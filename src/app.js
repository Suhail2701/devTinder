const express = require('express');
require('dotenv').config();
require('./config/database');
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://3.24.179.203"],
    credentials:true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.get('/feed', async (req, res) => {
//     const userEmail = req.body.emailId;
//     try {
//         let allUsers = await User.findOne({ emailId: userEmail });
//         if (!allUsers) res.send("User not found");
//         res.send(allUsers);
//         console.log(allUsers);
//     }
//     catch (err) {
//         res.status(400).send("Error fetching the feed");
//     }
// });

// app.delete('/user', async (req, res) => {
//     const userId = req.body.userId;
//     console.log(userId);
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         // const user = await User.findByIdAndDelete({_id: userId});
//         console.log(user);
//         res.send("User deleted successfully");
//     }
//     catch (error) {
//         console.log(error);
//         res.status(400).send("Something went wrong ", error);
//     }
// });

// app.patch('/user/:userId', async (req, res) => {
//     // const userId = req.body.userId;
//     const userId = req.params?.userId;
//     const skills = req.body.skills;
//     // const emailId = req.body.emailId;
//     const data = req.body;
//     try {

//         const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

//         let isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

//         isUpdateAllowed = !(skills.length > 5);

//         if (!isUpdateAllowed) {
//             throw new Error("Update is not allowed");
//         }

//         // await User.findByIdAndUpdate(userId, data);
//         await User.findOneAndUpdate({ _id: userId }, data, {
//             runValidators: true,
//         });
//         res.send("User updated successfully");
//     }
//     catch (error) {
//         res.status(400).send("Something went wrong: " + error);
//     }
// });

connectDb()
    .then(() => {
        console.log("DB connected successfully");
        app.listen(process.env.PORT, "0.0.0.0", () => {
            console.log("Server is listening on Port number 3000....");
        });
    })
    .catch((err) => {

        console.error("Failed to connect DB"+ err);
    })

