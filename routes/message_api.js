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

/* GET users listing. */
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
            res.contentType('application/json');
            res.send([{
                "message": errors,
                "success": false
            }]);
            return;
        } else {
            if (connection) {
                var sSQL = 'INSERT INTO messages (user_id,receiver_id,message,datecreated) VALUES(\'' + req.body.user_id + '\',\'' + req.body.receiver_id + '\',\'' + mysql_real_escape_string(req.body.message) + '\',NOW())';
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


router.route('/chat/:user_id/:receiver_id')
    .get(function(req, res) {
        var user_id = req.params.user_id;
        var receiver_id = req.params.receiver_id;

        if (connection) {
            var queryString = 'SELECT * FROM messages where user_id = ? AND receiver_id=?';
            connection.query(queryString, [user_id, receiver_id], function(err, rows, fields) {
                if (err) throw err;
                res.contentType('application/json');
                res.send(rows);
                res.end();
            });
        }
    })
    .delete(function(req, res) {
        connection.query('DELETE FROM messages WHERE user_id = ' + req.params.user_id + ' AND receiver_id = ' + req.params.receiver_id, function(err, result) {
            if (err) throw err;

            if (result)
                res.type('application/json');
            res.send([{
                "message": 'Message deleted',
                "success": true
            }]);
        });
    });

router.route('/chat/delete/:user_id/:chat_id')
    .delete(function(req, res) {
        connection.query('DELETE FROM messages WHERE user_id = ' + req.params.user_id + ' AND id = ' + req.params.chat_id, function(err, result) {
            if (err) throw err;

            if (result)
                res.type('application/json');
            res.send([{
                "message": 'Message deleted',
                "success": true
            }]);
        });
    });

module.exports = router;
