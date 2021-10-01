const mongoose = require('mongoose');

const tags = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Tags', tags);


