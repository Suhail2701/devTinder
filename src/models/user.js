const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength: 4
    },
    lastName:{
        type:String,
        maxLength:20,
        required: true
    },
    emailId:{
        type:String,
        lowercase: true,
        trim: true,
        required: true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email Id: " + value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value)
        {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Please enter a strong password");
            }
        }
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value)
        {
            if(!['male', 'female', 'others'].includes(value))
            {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://tse2.mm.bing.net/th/id/OIP.pdvfQNULMSlYCzmwIZONTwHaHa?pid=Api&P=0&h=220",
        validate(value)
        {
            if(!validator.isURL(value))
            {
                throw new Error("Invalid photo URL");
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about value"
    },
    skills:{
        type:[String],

    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    }
}, {
    timestamps: true
});


userSchema.methods.getJwt = async function()
{
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Suhail@123", {expiresIn:"7d"});
    return token;
}


userSchema.methods.validatePassword = async function(userEnteredPassword)
{
    const user = this;
    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(userEnteredPassword, hashedPassword);

    return isPasswordValid;

}

const User = mongoose.model("User", userSchema);

module.exports = User;

