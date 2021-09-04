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

async function createRecipe(req, res) {
        console.log(req.body);
        const rcp = new recipe({
            
            title: req.body.title,
            img: req.body.img,
            otherImgs: req.body.otherImgs,
            ingredients: req.body.ingredients,
            category: req.body.category,
            tags: req.body.tags,
            time: req.body.time,
            likes: req.body.likes,
            steps: req.body.steps,
            user: req.body.user,
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
