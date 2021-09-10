const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

} , { timestamps: true, autoCreate: true });


module.exports = mongoose.model('Notes', notesSchema);