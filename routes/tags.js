const express = require('express');
const router = express.Router();
const tagsCtrl = require('../controllers/tagsController.js');

//Getting all tags
router.get('/', tagsCtrl.getAllTags);

//Create tag
router.post('/', tagsCtrl.createTag);

//Delete tag
router.delete('/:id', tagsCtrl.deleteTag);

module.exports = router;