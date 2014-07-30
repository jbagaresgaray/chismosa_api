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
    res.send('this is the Login API');
});

router.route('/user/login')
    .post(function(req, res) {

        req.checkBody('mobile_number', 'Please enter Mobile Number').notEmpty();
        req.checkBody('password', 'Please enter Password').notEmpty();

        var errors = req.validationErrors(true);
        if (errors) {
            res.contentType('application/json');
            res.json([{
                message: errors,
                success: false
            }]);
            return;
        } else {
            if (connection) {
                /*var queryString = 'SELECT id,name,areacode,mobile_number,email,pic_file_name,cover_file_name
                FROM user WHERE CONCAT(areacode,mobile_number)=? AND `password`=?';*/
                var queryString = 'SELECT * FROM user WHERE CONCAT(areacode,mobile_number)=? AND `password`=?';
                console.log(queryString);
                connection.query(queryString, [req.body.mobile_number, req.body.password], function(err, row, fields) {
                    if (err) throw err;

                    var primPic, coverPhoto;
                    console.log(row.length);
                    if (row.length > 0) {
                        if (row[0].pic_blob) {
                            primPic = new Buffer(row[0].pic_blob, 'binary').toString('base64');
                        } else {
                            primPic = null;
                        }

                        if (row[0].cover_blob) {
                            coverPhoto = new Buffer(row[0].cover_blob, 'binary').toString('base64');
                        } else {
                            coverPhoto = null;
                        }

                        res.json([{
                            users: [{
                                active: row[0].active[0],
                                areacode: row[0].areacode,
                                cover_blob: coverPhoto,
                                cover_file_name: row[0].cover_file_name,
                                datecreated: row[0].datecreated,
                                dateupdated: row[0].dateupdated,
                                email: row[0].email,
                                facebook: row[0].facebook,
                                facebook_password: row[0].facebook_password,
                                gplus: row[0].gplus,
                                gplus_password: row[0].gplus_password,
                                id: row[0].id,
                                linkedin: row[0].linkedin,
                                linkedin_password: row[0].linkedin_password,
                                message_status: row[0].message_status,
                                mobile_number: row[0].mobile_number,
                                name: row[0].name,
                                password: row[0].password,
                                pic_blob: primPic,
                                pic_file_name: row[0].pic_file_name,
                                twitter: row[0].twitter,
                                twitter_password: row[0].twitter_password
                            }],
                            success: true
                        }]);
                        res.end();
                    } else {
                        res.contentType('application/json');
                        res.send([{
                            "success": false,
                            "message": 'No user existed with that account ^_^'
                        }]);
                        res.end();
                    }

                });
            }
        }

    });


module.exports = router;
