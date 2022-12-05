const express = require('express');
const PresetModel = require('../models/preset');

const router = express.Router();

class PresetDB {
    static _inst_;
    static getInst = () => {
        if ( !PresetDB._inst_ ) PresetDB._inst_ = new PresetDB();
        return PresetDB._inst_;
    }

    constructor() { console.log("[PresetDB] PresetDB Init call"); }

    selectPreset = async (username) => {
        try {
            const res = await PresetModel.find( {username: username});
            const data = [];
            res.map( (p) => data.push({ alias: p.alias, preset: p.preset}))
            return { success: true, data: data };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    addPreset = async (data) => {
        const { presetAlias, presetFood, username } = data;
        try {
            const findFilter = { alias: presetAlias, username: username };
            const findRes = await PresetModel.find(findFilter);
            console.log(findRes);
            if (findRes.length > 0) {
                const res = await PresetModel.updateOne(findFilter, data);
            } else {
                const newPreset = new PresetModel(data);
                const res = await newPreset.save();
            }
            return { success: true };
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
    deletePreset = async (presetAlias, username) => {
        try {
            const deleteFilter = { alias: presetAlias, username: username };
            const res = await PresetModel.deleteOne(deleteFilter);
            return { success: true }
        } catch (e) {
            return { success: false, data: `DB Error: ${ e }` };
        }
    }
}


const presetDBInst = PresetDB.getInst();

router.get('/getPresets', async (req, res) => {
    try {
        const PresetDBRes = await presetDBInst.selectPreset(req.query.username);
        if (PresetDBRes.success) return res.status(200).json(PresetDBRes.data);
        else return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/addPreset', async (req, res) => {
    try {
        const data = req.body;
        const PresetDBRes = await presetDBInst.addPreset(data);
        if (PresetDBRes.success) return res.status(200).json();
        return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
router.post('/deletePreset', async (req, res) => {
    try {
        const { presetAlias, username } = req.body;
        const PresetDBRes = await presetDBInst.deletePreset(presetAlias, username);
        if (PresetDBRes.success) return res.status(200).json();
        return res.status(500);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;