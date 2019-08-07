/* jshint esversion: 6*/
const express = require('express');
var router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sampleapp1891@gmail.com',
        pass: 'Papaisgreat1@'
    }
});
router.get('/', function(req, res) {
    // res.redirect('/login');
});

/* API to get data of a particular user */
router.get('/allUsers/:email', function(req, res, next) {
    let usersDB = req.users;
    let email = req.params.email;
    console.log(email);
    usersDB.findOne({
        email: email
    }, function(err, result) {
        if (err) {
            req.json_op_status = 0;
            req.json_op_message = err;
            next();
        } else if (result) {
            req.json_op_status = 1;
            req.json_op_data = result;
            req.json_op_message = 'User detail by using email';
            next();
        } else {
            req.json_op_status = 0;
            req.json_op_message = 'User does not exist!';
            next();
        }
    });
});

/* API to delete all users data */
router.delete('/deleteAllUser', function(req, res, next) {
    let usersDB = req.users;
    usersDB.deleteMany({}, function(err, result) {
        if (err) {
            req.json_op_status = 0;
            req.json_op_message = err;
            next();
        } else if (result) {
            if (result.acknowledged) {
                req.json_op_status = 1;
                req.json_op_message = ' All Users deleted successfully!';
            } else {
                req.json_op_status = 0;
                req.json_op_message = 'User deletion process failed!';
            }
            next();
        } else {
            req.json_op_status = 0;
            req.json_op_message = 'Empty Collection!';
            next();
        }
    });

});

/* POST API for Register User. */
router.post('/insertUser', function(req, res, next) {
    let usersDB = req.users;
    let name = req.body.name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let address = req.body.address;
    let validEmail = false;

    function validateEmail(email) {
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    if (email) {
        validEmail = validateEmail(email);
    }

    if (!validEmail) {
        req.json_op_status = 0;
        req.json_op_message = 'Invaild Email!';
        next();
    }

    if (name && email && address && mobile) {
        usersDB.findOne({
            email: email
        }, function(error, records) {
            if (error) {
                req.json_op_status = 0;
                req.json_op_message = error;
                next();
            } else if (!records) {
                let record = new usersDB({
                    name: name,
                    email: email,
                    address: address,
                    mobile: mobile
                });
                record.save(function(err) {
                    if (err) {
                        req.json_op_status = 0;
                        req.json_op_message = err;
                        next();
                    } else {
                        req.json_op_status = 1;
                        req.json_op_message = "User inserted successfully!";
                        next();
                    }
                });
            } else {
                req.json_op_status = 0;
                req.json_op_message = 'User already available!';
                next();
            }
        });
    } else {
        req.json_op_status = 0;
        req.json_op_message = 'Fill all fields!';
        next();
    }
});

/* GET API for List of Users. */
router.get('/allUsers', function(req, res, next) {
    let usersDB = req.users;
    usersDB.find({}, function(err, result) {
        if (err) {
            req.json_op_status = 0;
            req.json_op_message = err;
            next();
        } else if (result && result.length) {
            req.json_op_status = 1;
            req.json_op_data = result;
            req.json_op_message = 'List of all Users';
            next();
        } else {
            req.json_op_status = 0;
            req.json_op_message = 'User does not exist!';
            next();
        }
    });
});

/* Delete API for Delete a particular User. */
router.delete('/deleteUser/:email', function(req, res, next) {
    let usersDB = req.users;
    let email = req.params.email;
    if (email) {
        usersDB.remove({
            email: email
        }, function(err, result) {
            if (err) {
                req.json_op_status = 0;
                req.json_op_message = err;
                next();
            } else if (result) {
                if (result.deletedCount === 1) {
                    req.json_op_status = 1;
                    req.json_op_message = 'User deleted successfully!';
                } else {
                    req.json_op_status = 0;
                    req.json_op_message = 'User deletion process failed!';
                }
                next();
            } else {
                req.json_op_status = 0;
                req.json_op_message = 'User does not exist!';
                next();
            }
        });
    } else {
        req.json_op_status = 0;
        req.json_op_message = 'Email can not be blank';
        next();
    }
});

/* Update API for update a particular User's info. */
router.patch('/updateUser', function(req, res, next) {
    let usersDB = req.users;
    let email = req.body.email;
    let name = req.body.name;
    let phone = req.body.phone;
    let address = req.body.address;
    let updatedData = {
        email: email
    };
    if (name) {
        updatedData.name = name;
    }
    if (phone) {
        updatedData.phone = phone;
    }
    if (address) {
        updatedData.address = address;
    }
    if (email) {
        usersDB.update({
            email: email
        }, {
            $set: updatedData
        }, function(err, result) {
            if (err) {
                req.json_op_status = 0;
                req.json_op_message = err;
                next();
            } else if (result) {
                if (result.nModified === 1) {
                    req.json_op_status = 1;
                    req.json_op_message = 'User updated successfully!';
                } else {
                    req.json_op_status = 0;
                    req.json_op_message = 'User updation process failed!';
                }
                next();
            } else {
                req.json_op_status = 0;
                req.json_op_message = 'User does not exist!';
                next();
            }
        });
    } else {
        req.json_op_status = 0;
        req.json_op_message = 'Email can not be blank';
        next();
    }
});

// /* POST API for Login User. */
// router.post('/login', function(req, res, next) {
//     var usersDB = req.users;
//     var email = req.body.email;
//     var password = req.body.password;
//     var incryptPassword = '';
//     var algorithm = 'aes-256-ctr',
//         predefinedPassword = 'd6F3Efeq';
//     if (password) {
//         var cipher = crypto.createCipher(algorithm, predefinedPassword);
//         incryptPassword = cipher.update(password, 'utf8', 'hex');
//         incryptPassword += cipher.final('hex');
//     } else {
//         req.json_op_status = 0;
//         req.json_op_message = 'Password can not be blank';
//         next();
//     }
//     if (email && password) {
//         usersDB.findOne({
//             email: email,
//             password: incryptPassword
//         }, function(error, records) {
//             if (error) {
//                 req.json_op_status = 0;
//                 req.json_op_message = error;
//                 next();
//             } else if (records) {
//                 res.render('welcome.html', {
//                     title: "Welcome"
//                 });
//             } else {
//                 req.json_op_status = 0;
//                 req.json_op_message = 'Invalid Credentails.';
//                 next();
//             }
//         });
//     } else {
//         req.json_op_status = 0;
//         req.json_op_message = 'Fill all fields';
//         next();
//     }
// });

// /* POST API for Reset Password for User. */
// router.post('/reset', function(req, res, next) {
//     var algorithm = 'aes-256-ctr',
//         predefinedPassword = 'd6F3Efeq';
//     var usersDB = req.users;
//     var email = req.body.email;
//     if (email) {
//         usersDB.findOne({
//             email: email
//         }, function(err, result) {
//             if (err) {
//                 req.json_op_status = 0;
//                 req.json_op_message = err;
//                 next();
//             } else if (result) {
//                 var decPassword = result.password;
//                 var decipher = crypto.createDecipher(algorithm, predefinedPassword);
//                 var dec = decipher.update(decPassword, 'hex', 'utf8');
//                 dec += decipher.final('utf8');
//                 let mailOptions = {
//                     from: 'sampleapp1891@gmail.com',
//                     to: email,
//                     subject: 'New Password',
//                     text: 'Your Password is : ' + dec + '.',
//                     html: '<h3>Your Password is : ' + dec + '.</h3>'
//                 };
//                 transporter.sendMail(mailOptions, function(error, info) {
//                     if (error) {
//                         req.json_op_status = 0;
//                         req.json_op_message = error;
//                         next();
//                     }
//                     req.json_op_status = 1;
//                     req.json_op_message = 'Check your mail account.';
//                     next();
//                 });
//             } else {
//                 req.json_op_status = 0;
//                 req.json_op_message = 'User does not exist';
//                 next();
//             }
//         });
//     } else {
//         req.json_op_status = 0;
//         req.json_op_message = 'Email can not be blank';
//         next();
//     }
// });

module.exports = router;