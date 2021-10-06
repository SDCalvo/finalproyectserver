const express = require('express');
const router = express.Router();
const recipe = require('../models/recipesModel.js');
const recipeCtrl = require('../controllers/recipesController.js');
const auth = require('../middlewares/middlewares');

//Getting all the data from the database
router.get('/', recipeCtrl.getAllRecipe);

//Getting recipes from a search
router.get('/search', recipeCtrl.getRecipesBySearch);

//get recipe by tag
router.get('/tag', recipeCtrl.getRecipesByTags);

//Getting one element from the database
router.get('/:id', getRecipe, recipeCtrl.getOneRecipe);


//add middleware for auth in create, patch and delete, make sure recipe model has user as required and modify all other functions accordingly
//Creating a new element in the database
router.post('/', recipeCtrl.createRecipe);

//Updating an existing element in the database
router.patch('/:id', auth.authenticateToken, getRecipe, recipeCtrl.updateRecipe);

//Deleting an existing element in the database
router.delete('/:id', auth.authenticateToken, getRecipe, recipeCtrl.deleteRecipe);


//Middleware for getting the id of a recipe
async function getRecipe(req, res, next) {
    let rcp
    try{
        rcp = await recipe.findById(req.params.id);
        if(rcp == null){
            return res.status(404).json({message: 'No such element'});
        }
    }catch(err){
        res.status(500).json({message: err.message });
        console.log("error: ", err);
    }

    res.recipe = rcp;
    next();
}

module.exports = router;