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
    res.send('this the Message / Chat API');
});

router.route('/chat')
    .post(function(req, res) {

        req.checkBody('message', 'Please enter Chat / Message').notEmpty();

        var errors = req.validationErrors(true);
        if (errors) {
            res.json({
                message: errors,
                success: false
            });
            return;
        } else {
            new employeeDB({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                managerId: req.body.managerId,
                managerName: req.body.managerName,
                reports: req.body.reports,
                title: req.body.title,
                department: req.body.department,
                officePhone: req.body.officePhone,
                cellPhone: req.body.cellPhone,
                email: req.body.email,
                city: req.body.city,
                pic: req.body.pic,
                twitterId: req.body.twitterId,
                facebook: req.body.facebook
            }).save(function(err, employeedbs) {
                if (err) return next(err);
                res.json({
                    message: 'Record created!',
                    _id: employeedbs._id,
                    success: true
                });
            })
        }

    });


router.route('/chat/user/:user_id')
    .get(function(req, res) {
        employeeDB.findOne({
            _id: req.params.id
        }, function(err, employeedbs) {
            if (err)
                res.send(err);
            res.json(employeedbs);
        })
    })
    .delete(function(req, res) {
        employeeDB.remove({
            _id: req.params.id
        }, function(err, employeedbs) {
            if (err)
                res.send(err);
            res.json({
                message: 'Successfully deleted',
                success: true
            });
        })
    });

module.exports = router;
