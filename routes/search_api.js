var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chismosa'
});

function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
        }
    });
}

router.get('/', function(req, res) {
    res.send('this is the Search API');
});


router.route('/search')
    .post(function(req, res) {

        req.checkBody('searchKey', 'Please enter value to search').notEmpty();
        req.checkBody('user_id', 'No user_id').notEmpty();

        var errors = req.validationErrors(true);
        if (errors) {
            res.contentType('application/json');
            res.send([{
                "message": errors,
                "success": false
            }]);
            res.end();
            return;
        } else {

            if (connection) {
                var queryString = 'SELECT * FROM user where ((user.name LIKE \'' + mysql_real_escape_string(req.body.searchKey) + '%\') OR (email LIKE \'' + mysql_real_escape_string(req.body.searchKey) + '%\') OR (mobile_number LIKE \'' + mysql_real_escape_string(req.body.searchKey) + '%\')) AND id <> \'' + req.body.user_id + '\'';
                console.log(queryString);
                connection.query(queryString, function(err, row, fields) {
                    if (err) throw err;

                    var primPic, coverPhoto;
                    if (row.length > 0) {

                        var data = new Array();
                        for (var i = 0; i < row.length; i++) {
                            var b = new Object();

                            if (row[i].pic_blob != null) {
                                console.log('pumusok sa blob 1' + row[i].pic_blob.length);
                                primPic = new Buffer(row[i].pic_blob, 'binary').toString('base64');
                            } else {
                                primPic = null;
                            }

                            if (row[i].cover_blob != null) {
                                console.log('pumusok sa blob 2');
                                coverPhoto = new Buffer(row[i].cover_blob, 'binary').toString('base64');
                            } else {
                                coverPhoto = null;
                            }

                            b.active = row[i].active[0];
                            b.areacode = row[i].areacode;
                            b.cover_blob = coverPhoto;
                            b.cover_file_name = row[i].cover_file_name;
                            b.datecreated = row[i].datecreated;
                            b.dateupdated = row[i].dateupdated;
                            b.email = row[i].email;
                            b.facebook = row[i].facebook;
                            b.facebook_password = row[i].facebook_password;
                            b.gplus = row[i].gplus;
                            b.gplus_password = row[i].gplus_password;
                            b.id = row[i].id;
                            b.linkedin = row[i].linkedin;
                            b.linkedin_password = row[i].linkedin_password;
                            b.message_status = row[i].message_status;
                            b.mobile_number = row[i].mobile_number;
                            b.name = row[i].name;
                            b.password = row[i].password;
                            b.pic_blob = primPic;
                            b.pic_file_name = row[i].pic_file_name;
                            b.twitter = row[i].twitter;
                            b.twitter_password = row[i].twitter_password;

                            data.push(b);
                        };
                        res.json(data);
                    } else {
                        res.contentType('application / json ');
                        res.send([]);
                        res.end();
                    }

                });
            }
        }
    });


module.exports = router;
