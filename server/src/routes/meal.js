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

module.exports = router;