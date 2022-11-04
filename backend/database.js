require('dotenv').config();
const mongoose = require('mongoose');

const conn = mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Successfully connected to the Databaese");
});

exports.connection = function() {
    return conn;
}

