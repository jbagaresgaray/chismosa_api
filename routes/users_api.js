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
    res.send('this is the User API');
});

router.route('/user')
    .get(function(req, res) {
        if (connection) {
            connection.query('SELECT id,name,areacode,mobile_number,email,pic_file_name,cover_file_name FROM user ORDER BY name', function(err, rows, fields) {
                if (err) throw err;

                if (rows) {
                    res.contentType('application/json');
                    res.send([{
                        "users": rows,
                        "success": true
                    }]);
                } else {
                    res.contentType('application/json');
                    res.send([{
                        "message": 'No user existed with that account',
                        "success": false
                    }]);
                }

            });
        }
    })
    .post(function(req, res) {

        req.checkBody('areacode', 'Please enter Area Code').notEmpty();
        req.checkBody('mobile_number', 'Please enter Mobile Number').notEmpty();
        req.checkBody('name', 'Please enter Name').notEmpty();
        req.checkBody('email', 'Please enter Email Address').notEmpty();
        req.checkBody('password', 'Please enter Password').notEmpty();

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
                var sSQL = 'INSERT INTO user (name,password,areacode,mobile_number,email,datecreated) VALUES(\'' + req.body.name + '\',\'' + req.body.password + '\',\'' + req.body.areacode + '\',\'' + req.body.mobile_number + '\',\'' + req.body.email + '\',NOW())';
                connection.query(sSQL,
                    function(err, rows, fields) {
                        if (err) throw err;
                        if (rows)
                            res.contentType('application/json');
                        res.send([{
                            "message": 'Record created!',
                            "_Id": rows.insertId,
                            "success": true
                        }]);
                    });
            }
        }
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
                var queryString = 'SELECT id,name,areacode,mobile_number,email,pic_file_name,cover_file_name FROM user WHERE CONCAT(areacode,mobile_number)=? AND `password`=?';
                connection.query(queryString, [req.body.mobile_number, req.body.password], function(err, rows, fields) {
                    if (err) throw err;
                    res.contentType('application/json');
                    res.contentType('application/json');
                    res.send([{
                        "users": rows,
                        "success": true
                    }]);
                });
            }
        }

    });

router.route('/user/:id')
    .get(function(req, res) {
        var id = req.params.id;
        if (connection) {
            var queryString = 'SELECT * FROM user where id = ?';
            connection.query(queryString, [id], function(err, rows, fields) {
                if (err) throw err;
                res.contentType('application/json');
                res.send(rows);
                res.end();
            });
        }
    })
    .put(function(req, res) {
        req.checkBody('areacode', 'Please enter Area Code').notEmpty();
        req.checkBody('mobile_number', 'Please enter Mobile Number').notEmpty();
        req.checkBody('name', 'Please enter Name').notEmpty();
        req.checkBody('email', 'Please enter Email Address').notEmpty();

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
                var queryString = 'UPDATE user SET name=?, mobile_number=?,areacode=?,email=? where id = ?';
                connection.query(queryString, [req.body.name, req.body.mobile_number, req.body.areacode, req.body.email, req.params.id], function(err, result) {
                    if (err) throw err;

                    if (result)
                        res.type('application/json');
                    res.send([{
                        "message": 'Record Successfully updated!',
                        "success": true
                    }]);
                });
            }
        }
    })
    .delete(function(req, res) {
        connection.query('DELETE FROM user WHERE id = ' + req.params.id, function(err, result) {
            if (err) throw err;

            if (result)
                res.type('application/json');
            res.send([{
                "message": 'Successfully deleted',
                "success": true
            }]);
        });
    });


router.route('/user/picture:user_id')
    .get(function(req, res) {
        var id = req.params.user_id;
        if (connection) {
            var queryString = 'SELECT * FROM user_pic where id = ?';
            connection.query(queryString, [id], function(err, rows, fields) {
                if (err) throw err;
                res.contentType('application/json');
                res.send(rows);
                res.end();
            });
        }
    });


module.exports = router;
