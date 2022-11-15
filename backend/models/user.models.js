const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {type: String, required: false },
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true},
    spotify_username: {type: String, required: false, unique: true },
    token: {type: String, required: false},
    spotify_access_token: {type: String},
    spotify_refresh_token: {type: String},
    spotify_token_expiration: {type: Number},
});
module.exports = mongoose.model('User', userSchema);
