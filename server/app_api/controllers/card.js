var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var Theme = mongoose.model('Theme');
var Package = mongoose.model('Package');
var multer = require('multer');
var fs = require('fs');
/*
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
*/


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


    Word.findById(req.params.id, function(err, word) {
        if (err) {
            res.status(400).json(err)

        }
        if (word) {
            fs.exists('./' + word.imagePath, function(exists) {
                if (exists) {
                    fs.unlink('./' + word.imagePath, function(err) {
                        if (err) {
                            res.status(400).json(err)

                        }
                        console.log('successfully deleted image!');
                    });
                }
            })
            word.remove(function(err) {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json("word was deleted!")
                }
            })
        } else {
            res.end()
        }

    })


};

/*module.exports.updateWord = function(req, res) {

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
*/


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
                if (req.body.words) {
                    theme.wordId = req.body.words.split(',');
                }

                theme.save(function(err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json(theme);
                    }

                });


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
            res.status(400).json(err)
        }
        data.results = results;
        res.json(results)
    });


};
module.exports.addWordToTheme = function(req, res) {



    Theme.findById(req.params.themeId, function(err, theme) {

        theme.wordId = req.body.words.split(',');
        theme.save(function(err) {
            if (err) {
                res.json(err)
            } else {
                res.status(200).json("words was added")
            }

        });

    });


};
module.exports.getThemeWords = function(req, res) {



    Theme.findById(req.params.themeId, function(err, theme) {

        if (err) {
            res.status(400).json(err)
        } else {
            Word.find({
                _id: {
                    $in: theme.wordId
                }
            }, function(err, words) {

                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json(words)

                }

            });
        }

    });


};
module.exports.updateTheme = function(req, res) {

    Theme.findById(req.params.themeId, function(err, theme) {
        if (theme) {
            theme.name = req.body.name || theme.name;

            if (req.body.words) {
                theme.wordId = req.body.words.split(',')
            }
            theme.save(function(err) {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json(theme)
                }

            })
        } else {
            res.end("theme doesn't exist")
        }


    });


};
module.exports.deleteTheme = function(req, res) {


    Theme.findByIdAndRemove(req.params.id, function(err, theme) {
        if (err) {
            res.json(err)
        } else {
            res.json(" theme was delted")
        }
    })


};
module.exports.getLimitThemes = function(req, res) {
    var queryParams = {};
    queryParams.limit = Number(req.params.limit) || 10;
    var data = {};
    Theme.find({}).limit(queryParams.limit).exec(function(err, results) {
        if (err) {
            res.status(400).json(err)
        }
        data.results = results;
        res.status(200).json(results)
    });


};

module.exports.getTheme = function(req, res) {


    Theme.findById(req.params.id, function(err, theme) {
        if (err) {
            res.status(400).json(err)

        }
        if (theme) {
            res.status(200).json(theme)
        }

    })


};
module.exports.searchTheme = function(req, res) {
    Theme.find({
        name: {
            $regex: req.params.keyword,
            $options: 'i'
        }
    }, function(err, themes) {
        if (err) {
            res.status(400).json(err)

        }
        if (themes) {
            res.status(200).json(themes)
        }

    })



}
module.exports.createPackage = function(req, res) {

    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });

    } else {
        function stringGen(len) {
            var text = "";

            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < len; i++)
                text += charset.charAt(Math.floor(Math.random() * charset.length));

            return text;
        }

        var package = Package();
        package.name = req.body.name;
        package.packageCode = stringGen(6);
        if (req.body.themeId) {
            package.themeId = req.body.themeId;
        }


        package.save(function(err) {
            if (err) {
                res.json(err);
            } else {
                res.status(200).json(package);
            }

        })

    }


};
module.exports.getPackage = function(req, res) {


    Package.find({
        packageCode: req.params.packageCode
    }, function(err, package) {

        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(package)

        }

    });


};

module.exports.getPackages = function(req, res) {


    Package.find({}, function(err, packages) {

        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(packages)

        }

    });


};
module.exports.updatePackage = function(req, res) {

    if (req.body.secretKey != 'atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });

    } else {
        Package.findById(req.params.id, function(err, package) {
            if (err) {
                res.status(400).json(err)

            }
            if (package) {
                function stringGen(len) {
                    var text = "";

                    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < len; i++)
                        text += charset.charAt(Math.floor(Math.random() * charset.length));

                    return text;
                }

                package.name = req.body.name || package.name;
                package.packageCode = stringGen(6);
                if (req.body.themeId) {
                    package.themeId = req.body.themeId.split(',')
                } else {
                    package.themeId = package.themeId;
                }


                package.save(function(err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json(package);
                    }

                })

            }

        })

    }


};
module.exports.deletePackage = function(req, res) {


    Package.findByIdAndRemove(req.params.id, function(err, package) {
        if (err) {
            res.json(err)
        } else {
            res.json(" package was deleted")
        }
    })


};
