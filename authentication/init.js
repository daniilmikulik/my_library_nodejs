const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');

const saltRounds = 10;
const myPlainTextPassword = 'admin';
const salt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(myPlainTextPassword, salt);

const user = {
    username: 'admin',
    passwordHash,
    id: 1
}

function findUser(username, callback){
    console.log('Finding user...');
    if (username === user.username) {
        console.log('User found!');
        return callback(null, user);
    }
    console.log('User not found');
    console.log(username);
    return callback(null);
}

passport.serializeUser((user, cb) => {
    cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
    findUser(username, cb);
})

function initPassport() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            findUser(username, function (err, user) {
                console.log(password);
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false)
                }

                bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                    if (err)
                        return done(err);
                    if (!isValid)
                        return done(null, false);
                    return done(null, user);
                })
            })
        }
    ))
}

passport.authenticationMiddleware = authenticationMiddleware;
module.exports = initPassport;
