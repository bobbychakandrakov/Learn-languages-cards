var express = require('express');
var router = express.Router();


var ctrlCard = require('../controllers/card');

router.post('/word', ctrlCard.createWord);
router.get('/word/:id', ctrlCard.getWord);
router.delete('/word/:id', ctrlCard.deleteWord);
router.put('/word/:id', ctrlCard.updateWord);



module.exports = router;
