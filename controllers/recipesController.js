const mongoose = require('mongoose');
const recipe = require('../models/recipesModel.js');
const note = require('../models/notesModel.js');
const tags = require('../models/tagsModel.js');
    
async function getAllRecipe(req, res) {
    
    try{
        const recipes = await recipe.find().populate('tags', 'name');
        res.json(recipes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    return res;
}

async function getOneRecipe(req, res) {

        const rcp = res.recipe;
        try{
            const foundRecipe = await recipe.findById(rcp).populate('myFavorites', 'myRecipes', recipe);
            res.json(foundRecipe);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

async function getRecipesBySearch(req, res) {
    /*
        This function accepts an optional field value
        if the field value is provided, it will search for all the values 
        provided in the field provided
        if the field value is not provided, it will search for all
        the values provided in every field
    */
    try{
        const field = req.query.field;
        let search = req.query.search;
        if(field===undefined){
            //search for all the values in every field
            if(Array.isArray(search)){
                search = search.join(' ');
            }
            const recipes = await recipe.find({$text: {$search: search}});
            res.json(recipes);
        } else{
            //search for all the values in the field provided
            if(!Array.isArray(search)){
                search = [search];
            }
            for(let i=0; i<search.length; i++){
                search[i] = new RegExp(search[i], 'i');
            }
            const recipes = await recipe.find({[field]: {$in: search}});
            res.json(recipes);
        }  
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

async function createRecipe(req, res) {
        

        if(!req.body.title || !req.body.ingredients || !req.body.category || !req.body.tags || !req.body.time || !req.body.steps || !req.body.user){
            return res.status(400).json({message: 'Por favor llenar todos los campos obligatorios, los campos obligatorios son: title, ingredients, category, tags, time, steps, user'});
        }

        //find tags 
        let tagsArray = [];
        for(let i=0; i<req.body.tags.length; i++){

            const tag = await tags.findOne({name: req.body.tags[i]});
            if(tag){
                console.log("tag", tag);
                //chack tagsArray dosen't have the tag
                if(!tagsArray.includes(mongoose.Types.ObjectId(tag._id))){
                    tagsArray.push(mongoose.Types.ObjectId(tag._id));
                }
            }else{
                res.status(400).json({message: `El tag ${req.body.tags[i]} no existe`});
            }
        }

        console.log("tagsArray", tagsArray);
        
        const rcp = new recipe({
            
            title: req.body.title,
            user: req.body.user,
            img: req.body.img,
            otherImgs: req.body.otherImgs,
            ingredients: req.body.ingredients,
            category: req.body.category,
            tags: [...tagsArray],
            time: req.body.time,
            likes: req.body.likes,
            steps: req.body.steps,
            user: req.body.user,
            timeFreezer: req.body.timeFreezer,
            timeFridge: req.body.timeFridge,
        });
        try{
            const newRecipe = await rcp.save();
            
            res.status(201).json(newRecipe);
        } catch(err){
            res.status(400).json({message: err.message});
        }    
}

async function updateRecipe(req, res) {
        
        let rcp = res.recipe;
        rcp.title = req.body.title;
        rcp.img = req.body.img;
        rcp.otherImgs = req.body.otherImgs;
        rcp.ingredients = req.body.ingredients;
        rcp.category = req.body.category;
        rcp.accepted = req.body.accepted;
        rcp.time = req.body.time;
        rcp.likes = req.body.likes;
        rcp.steps = req.body.steps;
        rcp.user = req.body.user;
        rcp.timeFreezer = req.body.timeFreezer;
        rcp.timeFridge = req.body.timeFridge;

        //get tags from the request
        let tagsArray = [];
        for(let i=0; i<req.body.tags.length; i++){
            const tag = await tags.findOne({name: req.body.tags[i]});
            if(tag){
                tagsArray.push(mongoose.Types.ObjectId(tag._id));
            }else{
                res.status(400).json({message: `El tag ${req.body.tags[i]} no existe`});
            }
        }
        rcp.tags = tagsArray;
        console.log("tagsArray", tagsArray);
        try{
            const updatedRecipe = await recipe.findOneAndUpdate({_id: rcp._id}, rcp, {new: true});
            res.json(updatedRecipe);
        } catch(err){
            console.log("error: ", err);
            res.status(400).json({message: err.message});
    }    
}

async function getRecipesByTags(req, res) {
    try{
        const tags = req.body.tags.map(tag => mongoose.Types.ObjectId(tag));
        const recipes = await recipe.find({tags: {$in: tags}});
        res.json(recipes);
    }catch(err){
        res.status(500).json({message: err.message});
    }   
}

async function deleteRecipe(req, res) {
    try{
        const deletedRecipe = await recipe.findByIdAndRemove(req.params.id);
        res.json(deletedRecipe);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getAllRecipe = getAllRecipe;
exports.getOneRecipe = getOneRecipe;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
exports.getRecipesBySearch = getRecipesBySearch;
exports.getRecipesByTags = getRecipesByTags;

