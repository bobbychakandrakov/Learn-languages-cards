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
});
router.post('/word', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'maleVoice', maxCount: 1 },{ name: 'femaleVoice', maxCount: 1 }]), function(req, res) {
    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });
    } else {
        var word = new Word();
        word.eName = req.body.eName || 'test';
        word.bName = req.body.bName || 'test';

        if (req.files['image']!==undefined) {
            if (req.files['image'][0].mimetype.split('/')[0] === 'image') {
                word.imagePath = 'uploads/' + req.files[['image']][0].filename;
            }
        }

        if (req.files['maleVoice']!==undefined) {

            if (req.files['maleVoice'][0].mimetype.split('/')[0] === 'audio') {
                word.maleVoice.url = 'uploads/' + req.files['maleVoice'][0].filename || '';
                word.maleVoice.media = req.files['maleVoice'][0].mimetype;
            }

        }
        if (req.files['femaleVoice']!==undefined) {
            if (req.files['femaleVoice'][0].mimetype.split('/')[0] === 'audio') {
                word.femaleVoice.url = 'uploads/' + req.files['femaleVoice'][0].filename || '';
                word.femaleVoice.media = req.files['femaleVoice'][0].mimetype;
            }

        }

        word.save(function(err, word1) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                console.log('Word saved!');
                res.status(200).json(word1);
            }

        });

    }

});
router.put('/word/image/:id',upload.fields([{ name: 'image', maxCount: 1 }]), function(req, res) {
    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });
    } else {
        Word.findById(req.params.id, function(err, word) {
            if (err) {
                res.status(400).json(err);
            } else {

                word.eName = req.body.eName || word.eName;
                word.bName = req.body.bName || word.bName;
                if (req.files['image']!==undefined) {
                    fs.exists('./' + word.imagePath, function(exists) {
                        if (exists) {
                            fs.unlink('./' + word.imagePath, function(err) {
                                if (err) throw err;
                                else {
                                    console.log('successfully deleted image!');
                                    word.imagePath = 'uploads/' + req.files['image'][0].filename;
                                    word.save(function(err, word1) {
                                        if (err) {
                                            res.status(400).json(err)
                                        }
                                        res.json(word1);
                                    });

                                }

                            });
                        } else {
                            word.imagePath = 'uploads/' + req.files['image'][0].filename;
                            word.save(function(err, word1) {
                                if (err) {
                                    res.status(400).json(err)
                                }
                                res.status(200).json(word1);
                            });
                        }
                    })

                } else {
                    word.imagePath = word.imagePath
                    word.save(function(err, word1) {
                        if (err) {
                            res.status(400).json(err)
                        }
                        res.status(200).json(word1);
                    });

                }

            }

        });


    }

});
router.put('/word/voice/:id', upload.fields([{ name: 'maleVoice', maxCount: 1 },{ name: 'femaleVoice', maxCount: 1 }]), function(req, res) {
    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });
    } else {
        Word.findById(req.params.id, function(err, word) {
            if (err) {
                res.status(400).json(err);
            } else {

                word.eName = req.body.eName || word.eName;
                word.bName = req.body.bName || word.bName;
                if (req.files['maleVoice']!==undefined) {
                    fs.exists('./' + word.maleVoice.url, function(exists) {
                        if (exists) {
                            fs.unlink('./' + word.maleVoice.url, function(err) {
                                if (err) throw err;
                                else {
                                    console.log('successfully deleted male voice!');
                                    word.maleVoice.url = 'uploads/' + req.files['maleVoice'][0].filename || '';
                                    word.maleVoice.media = req.files['maleVoice'][0].mimetype;
                                    word.save(function(err, word1) {
                                        if (err) {
                                            res.status(400).json(err)
                                        }
                                       // res.status(200).json(word1);
                                    });

                                }

                            });
                        } else {
                            word.maleVoice.url = 'uploads/' + req.files['maleVoice'][0].filename || '';
                            word.maleVoice.media = req.files['maleVoice'][0].mimetype;
                            word.save(function(err, word1) {
                                if (err) {
                                    res.status(400).json(err)
                                }
                                //res.status(200).json(word1);
                            });
                        }
                    })

                }
                if (req.files['femaleVoice']!==undefined) {
                    fs.exists('./' + word.femaleVoice.url, function(exists) {
                        if (exists) {
                            fs.unlink('./' + word.femaleVoice.url, function(err) {
                                if (err) throw err;
                                else {
                                    console.log('successfully deleted female voice!');
                                    word.femaleVoice.url = 'uploads/' + req.files['femaleVoice'][0].filename || '';
                                    word.femaleVoice.media = req.files['femaleVoice'][0].mimetype;
                                    word.save(function(err, word1) {
                                        if (err) {
                                            res.status(400).json(err)
                                        }
                                        res.status(200).json(word1);
                                    });

                                }

                            });
                        } else {
                            word.femaleVoice.url = 'uploads/' + req.files['femaleVoice'][0].filename || '';
                            word.femaleVoice.media = req.files['femaleVoice'][0].mimetype;
                            word.save(function(err, word1) {
                                if (err) {
                                    res.status(400).json(err)
                                }
                                res.status(200).json(word1);
                            });
                        }
                    })

                } else {
                    word.maleVoice = word.maleVoice
                    word.femaleVoice = word.femaleVoice
                    word.save(function(err, word1) {
                        if (err) {
                            res.status(400).json(err)
                        }
                        res.status(200).json(word1);
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
router.post('/theme/word/:themeId', ctrlCard.addWordToTheme);
router.put('/theme/word/:themeId', ctrlCard.updateTheme);
router.get('/theme/word/:themeId', ctrlCard.getThemeWords);
router.delete('/theme/:id', ctrlCard.deleteTheme);
router.get('/theme/limit/:limit', ctrlCard.getLimitThemes);
router.get('/theme/:id', ctrlCard.getTheme);
router.get('/theme/search/:keyword', ctrlCard.searchTheme);
//search

router.get('/word/search/:keyword', ctrlCard.search);
router.get('/word/limit/:limit', ctrlCard.getLimitWords);
//themes Packages
router.post('/package', ctrlCard.createPackage);
router.get('/package/theme/:packageCode',ctrlCard.getPackage)
router.put('/package/:id', ctrlCard.updatePackage);
router.delete('/package/:id', ctrlCard.deletePackage);

module.exports = router;
