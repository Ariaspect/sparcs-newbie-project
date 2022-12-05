const mongoose = require('mongoose');

const Preset = new mongoose.Schema({
    alias: String,
    preset: String,
    username: String,
});

const PresetModel = mongoose.model("preset", Preset);

module.exports = PresetModel;