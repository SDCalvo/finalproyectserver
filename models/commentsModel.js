const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },

} , { timestamps: true, autoCreate: true });


module.exports = mongoose.model('Comments', commentsSchema);