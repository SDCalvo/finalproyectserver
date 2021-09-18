const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController.js');
const auth = require('../middlewares/middlewares');

//get all users
router.get('/', auth.authenticateToken, userCtrl.getUsers);

//get user by id
router.get('/:id', auth.authenticateToken, userCtrl.getUserById);

//delete user by id
router.delete('/:id', auth.authenticateToken, userCtrl.deleteUser);

// create user
router.post('/', userCtrl.createUser);

//login
router.post('/login', userCtrl.login);

//add recipe to favorites
router.post('/addToFavs', auth.authenticateToken, userCtrl.addRecipeToFavorites);

//like recipe
router.post('/like', auth.authenticateToken, userCtrl.likeRecipe);

module.exports = router;