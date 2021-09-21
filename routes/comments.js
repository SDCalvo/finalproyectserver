const express = require('express');
const router = express.Router();
const comment = require('../models/commentsModel.js');
const commentCtrl = require('../controllers/commentsController.js');
const auth = require('../middlewares/middlewares');

//Getting all the comments from a recipe
router.get('/:recipeId', auth.authenticateToken, commentCtrl.getCommentsFromRecipeId);

//create a comment
router.post('/', auth.authenticateToken, commentCtrl.createComment);

//delete a comment
router.delete('/:commentId', auth.authenticateToken, commentCtrl.deleteComment);

//update a comment
router.patch('/:commentId', auth.authenticateToken, commentCtrl.updateComment);

module.exports = router;