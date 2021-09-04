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
        type: String,
        required: false,
        enum: {
            values: ['Entrada', 'Plato principal', 'Dulce', 'Ensalada', 'Sopa', 'Tarta', 'Vegano', 'Rapido', 'Picante', 'sin TAAC', 'Desayuno', 'Salsa', 'Snack']
        }
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