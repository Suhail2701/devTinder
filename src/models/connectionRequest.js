const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  //reference to User collection
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true
    });


connectionRequestSchema.pre("save", async function()
{
    const connectionRequest = this;

    if(connectionRequest.fromUser.equals(connectionRequest.toUser))
    {
        throw new Error("Cannot send connection request to yourself");
        // return next(new Error("Cannot send request to yourself"));
    }

    // next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequestSchema);

module.exports = ConnectionRequestModel;