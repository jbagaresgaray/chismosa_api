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
    res.send('this the Message / Chat API');
});
router.route('/chat')
    .post(function(req, res) {
        req.checkBody('message', 'Please enter Chat / Message').notEmpty();
        req.checkBody('user_id', 'User ID is Empty').notEmpty();
        req.checkBody('receiver_id', 'Receiver ID is Empty').notEmpty();
        var errors = req.validationErrors(true);
        if (errors) {
            console.log(errors);
            res.contentType('application/json');
            res.send([{
                "message": errors,
                "success": false
            }]);
            return;
        } else {
            if (connection) {
                var sSQL = 'INSERT INTO messages (user_id,receiver_id,message,`from`,datecreated) VALUES(\'' + req.body.user_id + '\',\'' + req.body.receiver_id + '\',\'' + mysql_real_escape_string(req.body.message) + '\',\'' + req.body.user_id + '\',NOW())';
                connection.query(sSQL,
                    function(err, rows, fields) {
                        if (err) throw err;
                        if (rows)
                            res.contentType('application/json');
                        res.send([{
                            "message": 'Message Sent!',
                            "_Id": rows.insertId,
                            "success": true
                        }]);
                    });
            }
        }
    });
router.route('/chat/:user_id')
    .get(function(req, res) {
        var user_id = req.params.user_id;
        if (connection) {
            /*var queryString = 'SELECT  DISTINCT(SELECT name FROM user WHERE id = receiver_id LIMIT 1) AS `name`,(SELECT `pic_blob` FROM user WHERE id = receiver_id LIMIT 1) AS pic_blob,receiver_id,message, DATE_FORMAT(datecreated,\'%M %e, %h:%i%p\')  AS datecreated \
FROM messages WHERE user_id=' + user_id + ' AND `from` =' + user_id + ' GROUP BY receiver_id;';*/
            /*var queryString = 'SELECT  DISTINCT(SELECT name FROM user WHERE id = receiver_id LIMIT 1) AS `name`,(SELECT `pic_blob` FROM user WHERE id = receiver_id LIMIT 1) AS pic_blob,receiver_id,message, DATE_FORMAT(datecreated,\'%M %e, %h:%i%p\')  AS datecreated \
            FROM messages WHERE (user_id=' + user_id + ' OR `receiver_id` =' + user_id + ') GROUP BY receiver_id;';*/

            var queryString = 'SELECT DISTINCT U.`name`,U.pic_blob,U.id AS receiver_id,message,DATE_FORMAT(M.datecreated,\'%M %e, %h:%i%p\')  AS datecreated \
            FROM messages M, user U WHERE CASE WHEN M.user_id = ' + user_id + ' THEN M.receiver_id = U.id WHEN M.receiver_id= ' + user_id + ' THEN M.user_id= U.id END GROUP BY U.id;';

            connection.query(queryString, function(err, rows, fields) {
                if (err) throw err;
                var primPic;
                if (rows.length > 0) {
                    var data = new Array();
                    for (var i = 0; i < rows.length; i++) {
                        var b = new Object();
                        if (rows[i].pic_blob != null) {
                            primPic = new Buffer(rows[i].pic_blob, 'binary').toString('base64');
                        } else {
                            primPic = null;
                        }
                        b.id = rows[i].id;
                        b.name = rows[i].name;
                        b.pic_blob = primPic;
                        b.receiver_id = rows[i].receiver_id;
                        b.message = rows[i].message;
                        b.datecreated = rows[i].datecreated;
                        data.push(b);
                    }
                    res.contentType('application/json');
                    res.send([{
                        "success": true,
                        "data": data
                    }]);
                    res.end();
                } else {
                    res.contentType('application/json');
                    res.send([{
                        "success": false
                    }]);
                    res.end();
                }
            });
        }
    });

router.route('/chat/user/:user_id/:receiver_id')
    .get(function(req, res) {
        var user_id = req.params.user_id;
        var receiver_id = req.params.receiver_id;
        if (connection) {
            var queryString = 'SELECT id,user_id,receiver_id,message,DATE_FORMAT(datecreated,\'%M %e, %h:%i%p\')  AS datecreated\
            FROM messages where (user_id = \'' + user_id + '\' OR receiver_id=\'' + user_id + '\') AND (user_id = \'' + receiver_id + '\' OR receiver_id=\'' + receiver_id + '\')';

            connection.query(queryString, [user_id, receiver_id], function(err, rows, fields) {
                if (err) throw err;
                if (rows.length > 0) {
                    res.contentType('application / json');
                    res.send([{
                        "success": true,
                        "data": rows
                    }]);
                    res.end();
                } else {
                    res.contentType('application / json ');
                    res.send([{
                        "success": false
                    }]);
                    res.end();
                }
            });
        }
    })
    .delete(function(req, res) {
        connection.query('DELETE FROM messages WHERE user_id = ' + req.params.user_id + ' AND receiver_id = ' + req.params.receiver_id, function(err, result) {
            if (err) throw err;
            if (result)
                res.type('application / json ');
            res.send([{
                "message": 'Message deleted ',
                "success": true
            }]);
        });
    });

router.route(' / chat / delete / : user_id / : chat_id ')
    .delete(function(req, res) {
        connection.query('DELETE FROM messages WHERE user_id = ' + req.params.user_id + 'AND id = ' + req.params.chat_id, function(err, result) {
            if (err) throw err;
            if (result)
                res.type('application / json ');
            res.send([{
                "message": 'Message deleted ',
                "success": true
            }]);
        });
    });

module.exports = router;
