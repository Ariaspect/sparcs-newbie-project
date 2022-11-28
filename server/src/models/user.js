const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String
});

const UserModel = mongoose.model("user", User);

module.exports = UserModel;