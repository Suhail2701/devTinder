const mongoose = require('mongoose');

const url = "mongodb+srv://suhail:Sajo7XrId5oH6VLw@cluster0.5piu5y6.mongodb.net/devTinder";

async function connectDb()
{
    await mongoose.connect(url);
}

module.exports = connectDb;
