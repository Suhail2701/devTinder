const mongoose = require('mongoose');

async function connectDb()
{
    // console.log("process.env.DB_CONNECTION_URL: ", process.env.DB_CONNECTION_URL);
    await mongoose.connect( process.env.DB_CONNECTION_URL);
}

module.exports = connectDb;
