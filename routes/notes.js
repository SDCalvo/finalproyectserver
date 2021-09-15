const express = require('express');
const router = express.Router();
const note = require('../models/notesModel.js');
const noteCtrl = require('../controllers/notesController.js');
const auth = require('../middlewares/middlewares');

//Getting all the notes from a user
router.get('/all/:id', auth.authenticateToken, noteCtrl.getAllNotesFromUser);

//Getting one note from DB
router.get('/:id', getNote, auth.authenticateToken, noteCtrl.getOneNote);

//Creating a new element in the database
router.post('/',auth.authenticateToken, noteCtrl.createNote);

//Updating an existing element in the database
router.patch('/:id', getNote, auth.authenticateToken, noteCtrl.updateNote);

//Deleting an existing element in the database
router.delete('/:id', getNote, auth.authenticateToken, noteCtrl.deleteNote);

//Middleware for getting the id of a recipe
async function getNote(req, res, next) {
    let nt
    try{
        nt = await note.findById(req.params.id);
        if(nt == null){
            return res.status(404).json({message: 'No such element'});
        }
    }catch(err){
        res.status(500).json({message: err.message });
        console.log("error: ", err);
    }

    res.note = nt;
    next();
}

module.exports = router;