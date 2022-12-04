const express = require('express');
const mongoose = require('mongoose');
const MealSchema = require('../models/mealschema');


const router = express.Router();

class MealDB {
    static _inst_;
    static getInst = () => {
        if ( !MealDB._inst_ ) MealDB._inst_ = new MealDB();
        return MealDB._inst_;
    }

    constructor() {
        console.log("[MealDB] MealDB Init call")
    }

    selectMeals = async (username) => {
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const res = await MealModel.find();
            return { success: true, data: res };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    addMeals = async (mealItem, username) => {
        const { mealType, foodList, mealDate } = mealItem;
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const newMeal = new MealModel({ mealType: mealType, food: foodList, date: mealDate });
            await newMeal.save();
            return { success: true };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
}

const mealDBInst = MealDB.getInst();

router.get('/getMeals', async (req, res) => {
    try {
        const MealDBRes = await mealDBInst.selectMeals(req.query.username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/addMeals', async (req, res) => {
    try {
        const { data, username } = req.body;
        const MealDBRes = await mealDBInst.addMeals(data, username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;