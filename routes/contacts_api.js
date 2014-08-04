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
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
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


function createnotification(user_id, receiver_id, notify_desc) {
    if (connection) {
        var sSQL = 'INSERT INTO notification(user_id,receiver_id,notify_desc,datecreated,is_read)\
        VALUES(?,?,?,NOW(),0)';
        connection.query(sSQL, [user_id, receiver_id, notify_desc], function (err, result) {
            if (err) throw err;
            if (result) {
                console.log('save notification');
                return true;
            } else {
                console.log('not save notification');
                return false;
            }
        });
    }
}





router.get('/', function (req, res) {
    res.send('this the Contacts API');
});

router.route('/contacts')
    .post(function (req, res) {

        req.checkBody('areacode', 'Please enter Area Code').notEmpty();
        req.checkBody('mobile_number', 'Please enter Mobile Number').notEmpty();
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

            if (check_request() == true) {
                if (connection) {
                    var sSQL = 'INSERT INTO user_contacts (user_id,friend_id,status) VALUES(\'' + req.body.user_id + '\',\'' + req.body.friend_id + '\',0,NOW())';
                    connection.query(sSQL,
                        function (err, rows, fields) {
                            if (err) throw err;
                            res.contentType('application/json');
                            res.send([{
                                "message": 'Friend Request Sent!',
                                "_Id": rows.insertId,
                                "success": true
                            }]);
                        });
                }
            } else {
                res.contentType('application/json');
                res.send([{
                    "message": 'Friend request already sent!',
                    "_Id": rows.insertId,
                    "success": false
                }]);
            }
        }
    });

router.route('/contacts/:user_id')
    .get(function (req, res) {
        var user_id = req.params.user_id;
        if (connection) {
            var queryString = 'SELECT U.`id`,U.name AS contact_name ,U.email AS contact_email,U.areacode AS contact_areacode,U.mobile_number AS contact_number,U.pic_blob FROM user U INNER JOIN user_contacts F ON F.friend_id = U.id WHERE F.user_id = \'' + user_id + '\' AND F.`status` = 1 \
            UNION ALL\
            SELECT U.`id`,U.name AS contact_name ,U.email AS contact_email,U.areacode AS contact_areacode,U.mobile_number AS contact_number,U.pic_blob FROM user U INNER JOIN user_contacts F ON F.user_id = U.id WHERE F.friend_id = \'' + user_id + '\' AND F.`status` = 1;';

            // console.log(queryString);

            connection.query(queryString, function (err, rows, fields) {
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
                        b.contact_name = rows[i].contact_name;
                        b.pic_blob = primPic;
                        b.contact_areacode = rows[i].contact_areacode;
                        b.contact_number = rows[i].contact_number;
                        b.contact_email = rows[i].contact_email;

                        data.push(b);
                    }
                    res.json(data);
                } else {
                    res.type('application / json ');
                    res.send([]);
                    res.end();
                }
            });
        }
    });

router.route('/user_contacts/:user_id/:id')
    .get(function (req, res) {
        var user_id = req.params.user_id;
        var receiver_id = req.params.id;

        if (connection) {
            var queryString = 'SELECT U.`id`,U.name AS contact_name ,U.email AS contact_email,U.areacode AS contact_areacode,U.mobile_number AS contact_number,U.pic_blob\
        FROM user U WHERE U.id = \'' + receiver_id + '\';';

            connection.query(queryString, function (err, rows, fields) {
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
                        b.contact_name = rows[i].contact_name;
                        b.pic_blob = primPic;
                        b.contact_areacode = rows[i].contact_areacode;
                        b.contact_number = rows[i].contact_number;
                        b.contact_email = rows[i].contact_email;

                        data.push(b);
                    }
                    res.json(data);
                }
            });
        }
    })
    .delete(function (req, res) {
        var user_id = req.params.user_id;
        var receiver_id = req.params.id;

        connection.query('DELETE FROM user_contacts WHERE WHERE (user_id = \'' + user_id + '\' OR friend_id=\'' + user_id + '\') AND (user_id = \'' + receiver_id + '\' OR friend_id=\'' + receiver_id + '\') AND status = 1;',
            function (err, result) {
                if (err) throw err;

                if (result) {
                    res.type('application/json');
                    res.send([{
                        "message": 'Record successfully deleted!',
                        "success": true
                    }]);
                } else {
                    res.type('application/json');
                    res.send([{
                        "message": 'An error occur while deleting user\'s contact',
                        "success": false
                    }]);
                }
            });
    });









router.route('/contacts/request')
    .post(function (req, res) {

        req.checkBody('friend_id', 'No friend id found').notEmpty();
        req.checkBody('user_id', 'No user id found').notEmpty();

        var user_id = req.body.user_id;
        var receiver_id = req.body.friend_id;

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
                var queryString = 'SELECT * FROM user_contacts F WHERE (F.user_id =\'' + user_id + '\' OR F.friend_id = \'' + user_id + '\') AND (F.user_id =\'' + receiver_id + '\' OR F.friend_id = \'' + receiver_id + '\') AND (status = 0)';
                connection.query(queryString, function (err, rows, fields) {
                    if (err) throw err;
                    console.log(rows);
                    if (rows.length < 1) {
                        console.log('no friend request');

                        var sSQL = 'INSERT INTO user_contacts (user_id,friend_id,status) VALUES(\'' + req.body.user_id + '\',\'' + req.body.friend_id + '\',0)';
                        connection.query(sSQL, function (err, result) {
                            if (err) throw err;
                            if (result) {

                                createnotification(req.body.user_id, req.body.friend_id, 'New Friend Request');

                                res.type('application/json');
                                res.send([{
                                    "message": 'Friend Request Sent',
                                    "success": true
                                }]);
                            } else {
                                res.type('application/json');
                                res.send([{
                                    "message": 'An error occur while sending request to user',
                                    "success": false
                                }]);
                            }
                        });
                    } else {
                        console.log('check if friend ba or not');

                        var queryString = 'SELECT * FROM user_contacts F WHERE (F.user_id =\'' + user_id + '\' OR F.friend_id = \'' + user_id + '\') AND (F.user_id =\'' + receiver_id + '\' OR F.friend_id = \'' + receiver_id + '\') AND (status = 1)';
                        connection.query(queryString, [user_id, receiver_id], function (err, rows, fields) {
                            if (err) throw err;
                            console.log(rows);
                            if (rows.length > 0) {
                                console.log('friend true');
                                res.contentType('application/json');
                                res.send([{
                                    "message": 'Already a friend!',
                                    "success": false
                                }]);
                            } else {
                                console.log('friend false');
                                res.contentType('application/json');
                                res.send([{
                                    "message": 'Friend request already sent!',
                                    "success": false
                                }]);
                            }
                        });
                    }
                });

            }

        }
    });

router.route('/contacts/confirm/')
    .put(function (req, res) {

        req.checkBody('friend_id', 'No friend id found').notEmpty();
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
                var sSQL = 'UPDATE user_contacts SET status="1" WHERE (user_id= \'' + req.body.user_id + '\' OR friend_id=\'' + req.body.user_id + '\') \
                            AND \
                            (user_id=\'' + req.body.friend_id + '\' OR friend_id=\'' + req.body.friend_id + '\');';

                connection.query(sSQL, function (err, result) {
                    if (err) throw err;

                    if (result) {
                        res.type('application/json');
                        res.send([{
                            "message": 'Successfully added as friend',
                            "success": true
                        }]);
                    } else {
                        res.type('application/json');
                        res.send([{
                            "message": 'An error occur while sending request to user',
                            "success": false
                        }]);
                    }
                });
            }
        }
    });

router.route('/contacts/deny/')
    .put(function (req, res) {

        req.checkBody('friend_id', 'No friend id found').notEmpty();
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
                var sSQL = 'DELETE FROM user_contacts WHERE (user_id= \'' + req.body.user_id + '\' OR friend_id=\'' + req.body.user_id + '\') \
                            AND \
                            (user_id=\'' + req.body.friend_id + '\' OR friend_id=\'' + req.body.friend_id + '\');';

                console.log(sSQL);

                connection.query(sSQL, function (err, result) {
                    if (err) throw err;

                    if (result) {
                        res.type('application/json');
                        res.send([{
                            "message": 'Friend Request denied',
                            "success": true
                        }]);
                    } else {
                        res.type('application/json');
                        res.send([{
                            "message": 'An error occur while denying request to user',
                            "success": false
                        }]);
                    }
                });
            }
        }
    });



module.exports = router;
