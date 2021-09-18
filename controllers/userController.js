const userModel = require('../models/userModel.js');
const recipeModel = require('../models/recipesModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get all users
async function getUsers(req, res){
    try{
        const users = await userModel.find();
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
}

//create a user 
async function createUser(req, res) {

    const { email, password, name, lastName, role } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }
    if(!name) {
        return res.status(400).send({
            message: 'El campo nombre es requerido'
        });
    }
    if(!lastName) {
        return res.status(400).send({
            message: 'El campo apellido es requerido'
        });
    }
    if(!role) {
        return res.status(400).send({
            message: 'El campo rol es requerido'
        });
    }
    if(!role.includes('admin') && !role.includes('user')) {
        return res.status(400).send({
            message: 'Los valores válidos para el campo rol son admin o user'
        });
    }

    try{
        //make sure user doesn't already exist
        const oldUser = await userModel.findOne({
            where: {
                email
            }
        });
        
        if(oldUser) {
            return res.status(400).send({
                message: 'El usuario ya existe'
            });
        }
        //hash password
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await userModel.create({
            email: email.toLowerCase(),
            password: hash,
            name,
            lastName,
            role
        });
        res.json(user);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

async function login(req, res){
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }

    try{
        const user = await userModel.findOne({
            where: {
                email
            }
        });

        if(!user) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        //create token with 1 day expiration
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        
        const loggedUser = {
            ...user._doc,
            token: token
        };
        
        //delete password from user
        delete loggedUser.password;

        res.status(200).send(loggedUser);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

//add a recipe to users favorites
async function addRecipeToFavorites(req, res){
    
    const {recipeId, userId} = req.body;

    if(!recipeId) {
        return res.status(400).send({
            message: 'El ID de la receta es requerido'
        });
    }
    if(!userId) {
        return res.status(400).send({
            message: 'El ID del usuario es requerido'
        });
    }
    try{
        const user = await userModel.findOne({
            where: {
                _id: userId
            }
        });
        if(!user) {
            return res.status(401).send({
                message: 'Usuario no encontrado'
            });
        }
        const recipe = await recipeModel.findOne({
            where: {
                _id: recipeId
            }
        });
        if(!recipe) {
            return res.status(401).send({
                message: 'Receta no encontrada'
            });
        }
        const thisUser = await userModel.findOne({
            where: {
                _id: userId
            }
        });

        //check if user already has this recipe in favorites
        const recipeAlreadyInFavorites = thisUser.myFavorites.filter(fav => {
            console.log("tu", thisUser)
            const favId = fav.toString();
            return favId === recipeId});
        console.log(recipeAlreadyInFavorites);
        if(recipeAlreadyInFavorites.length > 0) {
            return res.status(400).send({
                message: 'Receta ya esta en favoritos'
            });
        }
        //add recipe to user's favorites
        thisUser.myFavorites.push(recipe);
        await thisUser.save();
        res.status(200).send({
            message: 'Receta agregada a favoritos'
        });
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

//give a recipe a like
async function likeRecipe(req, res){

    const {recipeId, userId} = req.body;
    console.log("userID", userId);
    if(!recipeId) {
        return res.status(400).send({
            message: 'El ID de la receta es requerido'
        });
    }
    if(!userId) {
        return res.status(400).send({
            message: 'El ID del usuario es requerido'
        });
    }
    try{
        const recipe = await recipeModel.findById(recipeId);
        if(!recipe) {
            return res.status(401).send({
                message: 'Receta no encontrada'
            });
        }
        const user = await userModel.findById(userId);
        console.log("user", user);
        if(!user) {
            return res.status(401).send({
                message: 'Usuario no encontrado'
            });
        }
        //check if user has liked this recipe already
        const userAlreadyLikedRecipe = recipe.usersLikes.filter(like => {
            
            const likeId = like.toString();
            console.log("likeId", likeId);
            console.log("userId", userId);
            return likeId === userId}
        );
        //if user has liked this recipe already, take one like from he recipe
        if(userAlreadyLikedRecipe.length > 0) {
            recipe.likes--;
            recipe.usersLikes = recipe.usersLikes.filter(like => {
                const likeId = like.toString();
                return likeId !== userId}
            );
        }
        //if user has not liked this recipe already, give it one like
        else {
            recipe.likes++;
            recipe.usersLikes.push(user._id);
        }
        await recipe.save();
        res.status(200).send({
            message: 'Receta actualizada'
        });
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}


exports.getUsers = getUsers;
exports.createUser = createUser;
exports.login = login;
exports.addRecipeToFavorites = addRecipeToFavorites;
exports.likeRecipe = likeRecipe;

