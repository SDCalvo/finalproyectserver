const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        unique: true
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
    usersLikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    steps: {
        type: Array,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeFridge: {
        type: String,
    },
    timeFreezer: {
        type: String,
    },

} , { timestamps: true, autoCreate: true });

//add text index to search all string fields
recipeSchema.index({
    title: 'text',
    ingredients: 'text',
    steps: 'text',
    time: 'text',
    timeFridge: 'text',
    timeFreezer: 'text',
    tags: 'text',
    category: 'text',
});


module.exports = mongoose.model('Recipe', recipeSchema);  