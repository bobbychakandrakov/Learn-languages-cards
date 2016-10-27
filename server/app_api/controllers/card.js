var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var multer = require('multer');
var fs = require('fs');
var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+".png");
    }
});
var upload = multer({ storage : storage}).single('userPhoto');

module.exports.createWord = function(req,res) {

    upload(req,res,function(err) {
        if(err) {
            res.end("Error uploading file.");
        }

        res.end("uploaded");
    });


    /*
    if (req.body.secretKey!='atanasov123') {
        res.status(401).json({
            "message": "UnauthorizedError: Only administrator can add data!!"
        });

    } else {
        var word=Word();
        word.eName=req.body.eName;
        word.bName=req.body.bName;
    Word.findOne({ eName:req.body.eName}, function (err, word1) {
        if (err) {
            res.status(400).json(err)

        }
        if (word1) {
            res.status(400).json("the word " + req.body.eName + " already exists!")
        } else {
            word.save(function (err) {
                if (err) return res.json(err);
                res.json("saved")
            })
        }

    })

    }
    */
};


module.exports.getWord = function(req, res) {


        Word.findById(req.params.id, function (err, word) {
            if (err) {
                res.status(400).json(err)

            }
            if (word) {
                res.status(200).json(word)
            }

        })


};
module.exports.deleteWord = function(req, res) {


    Word.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(400).json(err)

        }else{
            res.json("successfully deleted!!!");
        }


    });


};

module.exports.updateWord = function(req, res) {

    Word.findById(req.params.id, function (err,word) {
        if (err) {
            res.status(500).json(err);
        } else {

            word.eName = req.body.eName || word.eName;
            word.bName = req.body.bName || todo.bName;

            word.save(function (err, word1) {
                if (err) {
                    res.status(500).json(err)
                }
                res.json(word1);
            });
        }
    });


};


