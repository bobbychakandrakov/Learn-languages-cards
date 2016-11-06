var express = require('express');
var router = express.Router();
var ctrlCard = require('../controllers/card');
var multer = require('multer');
var fs = require('fs');
var Word = require('../models/word');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    //multer settings
    storage: storage
}).single('image');
router.post('/word', upload, function(req, res) {
    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });
    } else {
        var word = new Word();
        word.eName = req.body.eName || 'test';
        word.bName = req.body.bName || 'test';
        upload(req, res, function(err) {
            if (err) {
                res.json(err);
            } else {
                word.imagePath = 'uploads/' + req.file.filename;
                word.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json(err);
                    } else {
                        console.log('Word saved!');
                        res.json({
                            success: true
                        });
                    }

                });
            }
        });

    }

});
router.put('/word/:id', upload, function(req, res) {
   if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });
    } else {
        Word.findById(req.params.id, function(err, word) {
            if (err) {
                res.status(500).json(err);
            } else {

                word.eName = req.body.eName || word.eName;
                word.bName = req.body.bName || word.bName;
                if (req.file) {
                    upload(req, res, function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            fs.exists('./' + word.imagePath, function(exists) {
                                if (exists) {
                                    fs.unlink('./' + word.imagePath, function(err) {
                                        if (err) throw err;
                                        console.log('successfully deleted image!');
                                    });
                                }
                            })

                            word.imagePath = 'uploads/' + req.file.filename;
                            word.save(function(err) {
                                if (err) {
                                    console.log(err);
                                    res.json(err);
                                } else {
                                    console.log('Word saved!');
                                    res.json({
                                        success: true
                                    });
                                }

                            });
                        }
                    });
                } else {
                    word.imagePath = word.imagePath
                    word.save(function(err, word1) {
                        if (err) {
                            res.status(500).json(err)
                        }
                        res.json(word1);
                    });
                }

            }
        });

    }

});
router.get('/word/:id', ctrlCard.getWord);
router.delete('/word/:id', ctrlCard.deleteWord);
//router.put('/word/:id', ctrlCard.updateWord);
//theme routes
router.post('/theme', ctrlCard.createTheme);
//search
router.get('/word/search/:keyword', ctrlCard.search);
router.get('/word/limit/:limit', ctrlCard.getLimitWords);

module.exports = router;
