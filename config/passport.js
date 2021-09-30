var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'כתובת דואר אלקטרוני לא תקנית.').notEmpty().isEmail();
    req.check('password', 'הסיסמא אינה תקינה, שים/י לב כי על הסיסמא להיות מורכבת מאותיות באנגלית והיא חייבת להכיל לפחות אות אחת גדולה, ספרה וסימן מיוחד. אורכה של הסיסמא יהיה לפחות שמונה תווים.').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    /* req.checkBody('name', 'Invalid name').notEmpty().isLength({ min: 2 }); */
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'קיים רישום למערכת עם כתובת הדואר האלקטרונית הזו.' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
      /*   newUser.name = req.body.name; */
        newUser.role = 0;

        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'כתובת דואר אלקטרוני איננה תקנית..').notEmpty().isEmail();
    req.checkBody('password', 'סיסמא איננה תקנית.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'לא נמצא משתמש בעל כתובת הדוא"ל הזו במערכת.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'סיסמא לא נכונה.' });
        }
        return done(null, user);
    });

}));