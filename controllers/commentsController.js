const comment = require('../models/commentsModel.js');
const user = require('../models/userModel.js');
const recipe = require('../models/recipesModel.js');

//create a comment
async function createComment(req, res) {
    
    const { userId, recipeId, content } = req.body;
    
    if( !userId || !recipeId || !content ) {
        return res.status(400).json({
            message: 'Faltan datos, recuerde que los datos requeridos para esta request son: userId, recipeId, content',
        });
    }
    
    const newComment = new comment({
        userId,
        recipeId,
        content,
    });

    try {
        const currentUser = await user.findOne({ _id: userId });
        if (!currentUser) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
            });
        }
        //make sure recipe exists
        const currentRecipe = await recipe.findOne({ _id: recipeId });

        if (!currentRecipe) {
            return res.status(404).json({
                message: 'Receta no encontrada',
            });
        }

        newComment.userName = currentUser.name;
        newComment.userLastName = currentUser.lastName;

        const savedComment = await newComment.save();
        res.json(savedComment);
    } catch (err) {
        res.json({ message: err });
    }
}

//get all comments from a recipe Id
async function getCommentsFromRecipeId(req, res) {

    const { recipeId } = req.params;

    if( !recipeId ) {
        return res.status(400).json({
            message: 'Falta el id de la receta.',
        });
    }

    try {
        const currentRecipe = await recipe.findOne({ _id: recipeId });
        
        if (!currentRecipe) {
            return res.status(404).json({
                message: 'Receta no encontrada',
            });
        }
        const comments = await comment.find({ recipeId: recipeId });
        res.json(comments);
    } catch (err) {
        res.json({ message: err });
    }
}

//update a comment
async function updateComment(req, res) {

    const { commentId } = req.params;
    const { content, userId } = req.body;

    if( !commentId || !content ) {
        return res.status(400).json({
            message: 'Faltan datos, recuerde que los datos requeridos para esta request son: commentId, content',
        });
    }

    try {

        const currentComment = await comment.findOne({ _id: commentId });
        //make sure comment exists
        if (!currentComment) {
            return res.status(404).json({
                message: 'Comentario no encontrado',
            });
        }
        //make sure the user is the owner of the comment
        if (currentComment.userId != userId) {
            return res.status(401).json({
                message: 'No tienes permisos para editar este comentario',
            });
        }

        currentComment.content = content;

        const updatedComment = await currentComment.save();
        res.json(updatedComment);
    } catch (err) {
        res.json({ message: err });
    }
}

//delete comment
async function deleteComment(req, res) {

    const { commentId } = req.params;
    const { userId } = req.body;

    if( !commentId ) {
        return res.status(400).json({
            message: 'Falta el id del comentario.',
        });
    }

    try {

        const currentComment = await comment.findOne({ _id: commentId });
        //make sure comment exists
        if (!currentComment) {
            return res.status(404).json({
                message: 'Comentario no encontrado',
            });
        }
        //make sure the user is the owner of the comment
        if (currentComment.userId != userId) {
            console.log(currentComment.userId);
            console.log(userId);
            return res.status(401).json({
                message: 'No tienes permisos para eliminar este comentario',
            });
        }

        await currentComment.remove();
        res.json({ message: 'Comentario eliminado' });
    }
    catch (err) {
        res.json({ message: err });
    }
}

exports.createComment = createComment;
exports.getCommentsFromRecipeId = getCommentsFromRecipeId;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;


