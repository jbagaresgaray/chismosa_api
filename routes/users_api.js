var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chismosa'
});

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('this is the User API');
});

router.route('/user')
    .get(function(req, res) {
        if (connection) {
            connection.query('SELECT * FROM user ORDER BY name', function(err, rows, fields) {
                if (err) throw err;

                if (rows)
                    res.contentType('application/json');
                res.send(rows);
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


module.exports = router;