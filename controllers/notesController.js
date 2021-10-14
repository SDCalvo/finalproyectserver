const note = require('../models/notesModel.js');
const userModel = require('../models/userModel.js');

    
async function getAllNotesFromUser(req, res) {
    
    const user = req.params.userid;
    try{
        console.log(user);
        const notes = await note.find({user: user});
        res.status(200).json(notes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    return res;
}

async function getOneNote(req, res) {
        res.json(res.note); 
}

async function createNote(req, res) {
        console.log(req.body);
        const nt = new note({
            
            content: req.body.content,
            user: req.body.user,
            recipe: req.body.recipe
        });

        try{
            const thisUser = await userModel.findOne({_id: req.body.user});
            console.log("USER", thisUser);
            if(!thisUser){
                res.status(404).json({message: 'User not found'});
                return;
            }

            //update user's notes
            thisUser.notes.push(nt);
            await thisUser.save();

            const newNote = await nt.save();
            res.status(201).json(newNote);

        } catch(err){
            res.status(400).json({message: err.message});
        }    
}

async function updateNote(req, res) {
        
        let nt = res.note;
        nt.content = req.body.content;

        try{
            const updatedNote = await nt.save();
            res.status(201).json(updatedNote);
        } catch(err){
            res.status(400).json({message: err.message});
    }    
}

async function deleteNote(req, res) {
    try{
        await res.note.remove();
        res.json({message: 'Note deleted'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getAllNotesFromUser = getAllNotesFromUser;
exports.getOneNote = getOneNote;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;

