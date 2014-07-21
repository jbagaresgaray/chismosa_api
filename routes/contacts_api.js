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
    res.send('this the Contacts API');
});

router.route('/contacts')
    .post(function(req, res) {

        req.checkBody('areacode', 'Please enter Area Code').notEmpty();
        req.checkBody('mobile_number', 'Please enter Mobile Number').notEmpty();
        req.checkBody('name', 'Please enter Name').notEmpty();
        req.checkBody('email', 'Please enter Email Address').notEmpty();
        req.checkBody('password', 'Please enter Password').notEmpty();
        req.checkBody('user_id', 'No user id found').notEmpty();

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
                var sSQL = 'INSERT INTO user_contacts (user_id,contact_name,contact_areacode,contact_number,contact_email,date_create) VALUES(\'' + req.body.user_id + '\',\'' + req.body.name + '\',\'' + req.body.areacode + '\',\'' + req.body.mobile_number + '\',\'' + req.body.email + '\',NOW())';
                connection.query(sSQL,
                    function(err, rows, fields) {
                        if (err) throw err;

                        if (rows)
                            res.contentType('application/json');
                        res.send([{
                            "message": 'Contact successfully created!',
                            "_Id": rows.insertId,
                            "success": true
                        }]);
                    });
            }
        }
    });

router.route('/contacts/:user_id')
    .get(function(req, res) {
        var user_id = req.params.user_id;
        if (connection) {
            var queryString = 'SELECT * FROM user_contacts where user_id = ?';
            connection.query(queryString, [user_id], function(err, rows, fields) {
                if (err) throw err;
                res.contentType('application/json');
                res.send(rows);
                res.end();
            });
        }
    });

router.route('/user_contacts/:user_id/:id')
    .get(function(req, res) {
        var user_id = req.params.user_id;
        var id = req.params.id;

        if (connection) {
            var queryString = 'SELECT * FROM user_contacts where user_id = ? AND id = ?';
            connection.query(queryString, [user_id, id], function(err, rows, fields) {
                if (err) throw err;
                res.contentType('application/json');
                res.send(rows);
                res.end();
            });
        }
    });
