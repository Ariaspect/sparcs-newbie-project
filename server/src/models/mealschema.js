const mongoose = require('mongoose');

const MealItem = new mongoose.Schema({
    name: String,
    qty: Number
});

const Meal = new mongoose.Schema({
    mealType: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
    },
    food: [MealItem],
    date: String,
});

module.exports = Meal;

// const MealModel = mongoose.model("meal", Meal);

// module.exports = MealModel;