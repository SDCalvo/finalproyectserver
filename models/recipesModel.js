const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    otherImgs:{
        type: Array,
    },
    ingredients:{
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['Con carne', 'Veggies', 'Postres']
        }
    },
    tags: {
        type: Array,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0 
    },
    steps: {
        type: Array,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

} , { timestamps: true, autoCreate: true });

module.exports = mongoose.model('Recipe', recipeSchema);  