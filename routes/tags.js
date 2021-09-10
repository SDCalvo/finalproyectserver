const express = require('express');
const router = express.Router();
const tagsCtrl = require('../controllers/tagsController.js');

//Getting all tags
router.get('/', tagsCtrl.getAllTags);

module.exports = router;