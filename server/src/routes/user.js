const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const MealSchema = require('../models/mealschema');

const router = express.Router();

class UserDB {
    static _inst_;
    static getInst = () => {
        if ( !UserDB._inst_ ) UserDB._inst_ = new UserDB();
        return UserDB._inst_;
    }

    constructor() { console.log("[UserDB] UserDB Init call"); }

    initUser = async ( username ) => {
        try {
            const findRes = await UserModel.find({ "username": username });
            if (findRes == "") {
                console.log("[UserDB] Inserting new user: " + username);
                const newUser = new UserModel({ username });
                const res = await newUser.save();

                console.log("[MealDB] Init new collection: users." + username);
                const MealModel = mongoose.model("meal", MealSchema, "users." + username);

                return { success: true };
            } else {
                console.log("[UserDB] existing username")
                return { success: true };
            }
        } catch (e) {
            return { success: false };
        }
    }
}

const userDBInst = UserDB.getInst();

router.post('/initUser', async (req, res) => {
    try {
        const { username } = req.body;
        console.log("[router] initUser post with: " + username)
        const initResult = await userDBInst.initUser(username);
        if (initResult.success) return res.status(200).json(initResult.data);
        else return res.status(500).json({ error: "user already exists" });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;