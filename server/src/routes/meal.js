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

    selectMeal = async (username) => {
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const res = await MealModel.find();
            return { success: true, data: res };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    getMeal = async (mealType, mealDate, username) => {
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const updateFilter = { mealType: mealType, date: mealDate };
            const res = await MealModel.findOne(updateFilter);
            return { success: true, data: res };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    addMeal = async (mealItem, username) => {
        const { mealType, foodList, mealDate } = mealItem;
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const findFilter = { mealType: mealType, date: mealDate };
            const mealItem = { mealType: mealType, food: foodList, date: mealDate };
            const findRes = await MealModel.find(findFilter);
            if (findRes.length > 0) {
                const res = await MealModel.updateOne(findFilter, mealItem);
            } else {
                const newMeal = new MealModel(mealItem);
                const res = await newMeal.save();
            }
            return { success: true };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    deleteMeal = async (mealType, mealDate, username) => {
        let MealModel = mongoose.model("meal", MealSchema, "users." + username);
        try {
            const deleteFilter = { mealType: mealType, date: mealDate };
            await MealModel.deleteOne(deleteFilter);
            return { success: true }
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
}

const mealDBInst = MealDB.getInst();

router.get('/getMeals', async (req, res) => {
    try {
        const MealDBRes = await mealDBInst.selectMeal(req.query.username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/getMeal', async (req, res) => {
    try {
        const { mealType, mealDate, username } = req.body;
        const MealDBRes = await mealDBInst.getMeal(mealType, mealDate, username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/addMeals', async (req, res) => {
    try {
        const { data, username } = req.body;
        const MealDBRes = await mealDBInst.addMeal(data, username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/deleteMeals', async (req, res) => {
    try {
        const { mealType, mealDate, username } = req.body;
        const MealDBRes = await mealDBInst.deleteMeal(mealType, mealDate, username);
        if (MealDBRes.success) return res.status(200).json(MealDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;