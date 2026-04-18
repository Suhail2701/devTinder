const express = require('express');

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validatePassword, validateSignUpData} = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    // const user = User({
    //     firstName:"Suhail",
    //     lastName:"Ahmed",
    //     emailId:"suhail@gmail.com",
    //     password:"suhail@123"
    // })

    try {

        //Input data validation
        validateSignUpData(req);

        //Encrypt the password using bcrypt lib
        const { firstName, lastName, emailId, password, about, skills, photoUrl } = req.body;
        const hasedPassword = await bcrypt.hash(password, 10);

        console.log(hasedPassword);

        //Creating the new instance of the User Model

        const user = User({
            firstName,
            lastName,
            emailId,
            password: hasedPassword,  about, skills, photoUrl
        })
        const savedUser =await user.save();
        const token = await savedUser.getJwt();
        res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000)}); 
        res.json({message: "User created successfully", data: savedUser});

    }
    catch (err) {
        res.status(400).json({message: "Error creating user", error: err.message});
    }

});

authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        isUserExist = await User.findOne({ emailId });

        if (!isUserExist) {
            throw new Error("User does not exist");
        }

        // const isValidPassword = await bcrypt.compare(password, isUserExist.password);
        const isValidPassword = await isUserExist.validatePassword(password);

        if (isValidPassword) {
            // create a JWT Token
            // const token = await jwt.sign({ _id: isUserExist._id }, "Suhail@123", {expiresIn: '7d'});
            const token = await isUserExist.getJwt();
            console.log("Token: ", token);
            res.cookie("token", token);

            //Add the token to cookie and send the response back to the user
            
            res.send(isUserExist);
        }
        else {
            throw new Error("Invalid Password");
        }

    }
    catch (error) {
        res.status(400).send("Error: " + error);
    }
});

authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logged out successfully!.");
})

module.exports = authRouter;

