const mongoose = require('mongoose');

const tags = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true });

//add text index
tags.index({ name: 'text' });

module.exports = mongoose.model('Tags', tags);


