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
    res.send('this is the Friend Request API');
});

router.route('/notification/:user_id')
    .get(function(req, res) {

        var user_id = req.params.user_id;

        if (connection) {
            connection.query('SELECT n.id, n.notify_desc,u.name,u.mobile_number,u.email,u.id as user_id,u.pic_blob,DATE_FORMAT(n.datecreated,\'%M %e, %h:%i%p\') AS datecreated\
                FROM notification n ,user u WHERE CASE WHEN n.user_id = ' + user_id + ' THEN n.receiver_id = U.id WHEN n.receiver_id= ' + user_id + ' THEN n.user_id= U.id END AND n.is_read = 0;',
                function(err, rows, fields) {
                    if (err) throw err;

                    var primPic;
                    if (rows) {
                        var data = new Array();
                        for (var i = 0; i < rows.length; i++) {
                            var b = new Object();
                            if (rows[i].pic_blob != null) {
                                console.log('pumusok sa blob 1' + rows[i].pic_blob.length);
                                primPic = new Buffer(rows[i].pic_blob, 'binary').toString('base64');
                            } else {
                                primPic = null;
                            }

                            b.notify_desc = rows[i].notify_desc;
                            b.name = rows[i].name;
                            b.mobile_number = rows[i].mobile_number;
                            b.user_id = rows[i].user_id;
                            b.id = rows[i].id;
                            b.pic_blob = primPic;
                            b.email = rows[i].email;
                            b.datecreated = rows[i].datecreated;
                            data.push(b);
                        }
                        res.contentType('application/json');
                        res.send([{
                            "notif": data,
                            "success": true
                        }]);
                        res.end();
                    } else {
                        res.contentType('application/json');
                        res.send([{
                            "message": 'All caught up XD',
                            "success": false
                        }]);
                        res.end();
                    }

                });
        }
    });

router.route('/notification/read')
    .put(function(req, res) {
        req.checkBody('id', 'No notif_id found').notEmpty();

        var errors = req.validationErrors(true);
        if (errors) {
            res.contentType('application/json');
            res.send([{
                "message": errors,
                "success": false
            }]);
            return;
        } else {
            if (connection) {
                var sSQL = 'UPDATE notification SET is_read=1 WHERE id=?';
                connection.query(sSQL, [req.body.id], function(err, result) {
                    if (err) throw err;
                    if (result) {
                        res.type('application/json');
                        res.send([{
                            "success": true
                        }]);
                        res.end();
                    } else {
                        res.type('application/json');
                        res.send([{
                            "success": false
                        }]);
                        res.end();
                    }
                });
            }
        }
    });

module.exports = router;
