var express = require('express');
var router = express.Router();
var ctrlCard = require('../controllers/card');
//word routes
router.post('/word', ctrlCard.createWord);
router.get('/word/:id', ctrlCard.getWord);
router.delete('/word/:id', ctrlCard.deleteWord);
router.put('/word/:id', ctrlCard.updateWord);
//theme routes
router.post('/theme', ctrlCard.createTheme);
//search
router.get('/word/search/:keyword', ctrlCard.search);

module.exports = router;
