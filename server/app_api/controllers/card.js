var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var Theme = mongoose.model('Theme');
var multer = require('multer');
var fs = require('fs');

module.exports.createWord = function(req, res) {
    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });

    } else {
        var word = Word();
        word.eName = req.body.eName || 'test';
        word.bName = req.body.bName || 'test';

        Word.findOne({
            eName: req.body.eName
        }, function(err, word1) {
            if (err) {
                res.status(400).json(err)

            }
            if (word1) {
                res.status(400).json("the word " + req.body.eName + " already exists!")
            } else {
                upload(req, res, function(err) {
                    if (err) {
                        res.json(err);
                        return;
                    }

                    console.log('image is uploaded')
                    word.imagePath = req.file.path + req.file.filename
                    word.save(function(err) {
                        if (err) {
                            res.json(err)
                        } else {
                            res.json(" word is saved")
                        }

                    })

                });
                // word.save(function(err) {
                //     if (err) {
                //         res.json(err);
                //     } else {
                //         res.json(" word is saved");
                //     }
                //
                // });

            }

        })

    }

};


module.exports.getWord = function(req, res) {


    Word.findById(req.params.id, function(err, word) {
        if (err) {
            res.status(400).json(err)

        }
        if (word) {
            res.status(200).json(word)
        }

    })


};
module.exports.deleteWord = function(req, res) {


    Word.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(400).json(err)

        } else {
            res.json("successfully deleted!!!");
        }


    });


};

module.exports.updateWord = function(req, res) {

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
                        return;
                    }
                    word.imagePath = req.file.path + req.file.filename
                    console.log('image was uploaded')
                    word.save(function(err) {
                        if (err) {
                            res.json(err)
                        } else {
                            res.json(" word was saved")
                        }

                    })

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

};


module.exports.createTheme = function(req, res) {

    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });

    } else {
        var theme = Theme();
        theme.name = req.body.name;


        Theme.findOne({
            name: req.body.name
        }, function(err, theme1) {
            if (err) {
                res.status(400).json(err)

            }
            if (theme1) {
                res.status(400).json("the theme " + req.body.name + " already exists!")
            } else {
                theme.save(function(err) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json(" theme was created")
                    }

                })


            }

        });

    }


};
module.exports.search = function(req, res) {
    Word.find({
        eName: {
            $regex: req.params.keyword,
            $options: 'i'
        }
    }, function(err, words) {
        if (err) {
            res.status(400).json(err)

        }
        if (words) {
            res.status(200).json(words)
        }

    })



}

module.exports.getLimitWords = function(req, res) {
    
    var queryParams = {};
    queryParams.limit = Number(req.params.limit) || 10;
    var data = {};
    Word.find({}).limit(queryParams.limit).exec(function(err, results) {
        if (err) {
            throw err;
        }
        data.results = results;
        res.json(results)
    });


};
