const mongoose = require('mongoose');

const MealItem = new mongoose.Schema({
    name: String,
    qty: Number
});

const Meal = new mongoose.Schema({
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        default: 'snack'
    },
    food: [MealItem],
    date: String,
});

module.exports = Meal;

// const MealModel = mongoose.model("meal", Meal);

// module.exports = MealModel;