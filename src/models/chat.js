const mongoose = require("mongoose");
const User = require("./user");

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

const chatSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    }],
    messages:[messageSchema]
})

const Chat = mongoose.model("Chat",chatSchema );

module.exports = Chat;