const recipe = require('../models/recipesModel.js');
    
async function getAllRecipe(req, res) {
    
    try{
        const recipes = await recipe.find();
        res.json(recipes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    return res;
}

async function getOneRecipe(req, res) {
        res.json(res.recipe); 
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
        }else{
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
        console.log(req.body);

        if(!req.body.title || !req.body.ingredients || !req.body.category || !req.body.tags || !req.body.time || !req.body.steps || !req.body.user){
            return res.status(400).json({message: 'Por favor llenar todos los campos obligatorios, los campos obligatorios son: title, ingredients, category, tags, time, steps, user'});
        }

        const rcp = new recipe({
            
            title: req.body.title,
            user: req.body.user,
            img: req.body.img,
            otherImgs: req.body.otherImgs,
            ingredients: req.body.ingredients,
            category: req.body.category,
            tags: req.body.tags,
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
        rcp.tags = req.body.tags;
        rcp.time = req.body.time;
        rcp.likes = req.body.likes;
        rcp.steps = req.body.steps;
        rcp.user = req.body.user;
        rcp.timeFreezer = req.body.timeFreezer;
        rcp.timeFridge = req.body.timeFridge;
        console.log(rcp);
        try{
            const newRecipe = await rcp.save();
            res.status(201).json(newRecipe);
        } catch(err){
            res.status(400).json({message: err.message});
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
