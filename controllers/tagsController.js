const tags = require('../models/tagsModel');

async function getAllTags(req, res) {
    
    try {
        const foundTags = await tags.find();
        res.status(200).json(foundTags);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function createTag(req, res) {
    const tag = new tags({
        name: req.body.name
    });

    try {
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(500).json({
            message: error.message
      });
    }
}

async function deleteTag(req, res) {
    try {
        const deletedTag = await tags.findByIdAndDelete(req.params.id);
        res.status(200).json( {message: 'Tag deleted'} );
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


exports.getAllTags = getAllTags;
exports.createTag = createTag;
exports.deleteTag = deleteTag;