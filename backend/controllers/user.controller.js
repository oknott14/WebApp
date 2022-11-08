const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async function(_user) {
    return bcrypt.hash(_user.password, 10).then(hash => {
        const user = new User({
            name: _user.name,
            email: _user.email,
            password: hash,
            spotify_user_id: _user.spotifyUserId
        });

        return user.save().then(() => true);
    });
}

exports.login = async function(email, password) {
    let usr;
    return User.findOne({ email: email }).then(user => {
        if(!user) {
            throw Error("User Not Found");
        }
        usr = user;
        return bcrypt.compare(password, user.password)
    }).then(resp => {
        if (!resp) {
            throw Error("Incorrect Password");
        }
        const token = jwt.sign({date: Date(), email: usr.email, userId: usr._id}, process.env.JWT_SECRET, { expiresIn: "1d"});
        console.log("Logged in")
        usr.token = token;
        return usr.save().then(() => {
            return {
                token: token,
                id: usr._id
            }
        })
    })
}