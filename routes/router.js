const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded());

require('../authentication').init(router);

router.use(passport.initialize());
router.use(passport.session());

let library = require('../data/library');
let users = require('../data/users');
const path = require("path");

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/library', passport.authenticationMiddleware(),(req, res) => {
    res.render('index', {library : library});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/library',
    failureRedirect: '/'
}))

router.get('/library/:filter_mode', (req, res) => {
    const filterMode = req.params.filter_mode;
    let titles = []
    switch (filterMode){
        case "in":
            for(let elem of library){
                    titles.push({"title" : elem.title, "status" : elem.isInLibrary});
            }
            console.log('in');
            console.log(titles);
            res.end(JSON.stringify(titles));
            break;
        case "return":
            for(let elem of library){
                let status = "true";
                if (elem.dateGiven != "-" && elem.isInLibrary === "false")
                    status = "false";
                titles.push({"title" : elem.title, "status" : status});
            }
            console.log('return');
            console.log(titles);
            res.end(JSON.stringify(titles));
            break;
        case "expired":
            for(let elem of library){
                let status = "false";
                if (elem.dateOfReturn != "-" && elem.isInLibrary === "false") {
                    let dateOfReturn = new Date(elem.dateOfReturn);
                    let now = new Date();
                    let diff = dateOfReturn.getTime() - now.getTime();
                    console.log(diff);
                    if (diff < 0)
                        status = "true";
                    else
                        status = "false";
                }
                titles.push({"title" : elem.title, "status" : status});
            }
            console.log('expired');
            console.log(titles);
            res.end(JSON.stringify(titles));
            break;
        default:
            break;
    }
})

router.get('/book/:name', passport.authenticationMiddleware(), (req, res) =>{
    const name = req.params.name;
    let book = null;
    for (let elem of library){
        if (elem.title === name){
            book = elem;
            break;
        }
    }
    res.render('book', {book : book});
});

router.get('/edit/:mode', passport.authenticationMiddleware(),(req, res) =>{
    const mode = req.params.mode;
    res.render('edit_form', {mode : mode});
});

router.post('/add', (req, res) => {
    for (let elem of library) {
        if (elem.title == req.body.title) {
            res.redirect('/library');
            return;
        }
    }

    library.push({
        "title" : req.body.title,
        "author" : req.body.author,
        "dateOfCreation" : req.body.date,
        "isInLibrary" : "true",
        "dateGiven" : "-",
        "dateOfReturn" : "-",
        "keeperName" : "-"
    });
    res.redirect('/library');
} );

router.post('/:mode', (req, res) => {
    const name = req.params.mode;

    for (let elem of library) {
        if (elem.title == name) {
            console.log(req.body);
            if (req.body.title)
                elem.title = req.body.title;
            if (req.body.author)
                elem.author = req.body.author;
            if (req.body.date)
                elem.dateOfCreation = req.body.date;
            res.redirect('/library');
            return;
        }
    }

} );

router.get('/give/:name', (req, res) => {
    let name = req.params.name;
    console.log(name);
    console.log(req.query);

    for (let elem of library) {
        if (elem.title == name) {
            if (req.query.name){
                elem.keeperName = req.query.name;
            }
            if (req.query.dateOfReturn){
                let now = new Date();
                elem.dateGiven = formatDate(now);
                elem.dateOfReturn = req.query.dateOfReturn;
            }
            elem.isInLibrary = 'false';
            res.redirect('/library');
            return;
        }
    }
});

router.get('/return/:name', (req, res) => {
    let name = req.params.name;
    console.log(name);

    for (let elem of library) {
        if (elem.title == name) {
            elem.keeperName = "-";
            elem.dateGiven = "-";
            elem.dateOfReturn = "-";
            elem.isInLibrary = 'true';
            res.redirect('/library');
            return;
        }
    }
});


router.get('/delete/:name', (req, res) => {
    const name = req.params.name;
    for (let elem of library){
        if (elem.title == name){
            library.splice(library.indexOf(elem), 1);
            res.redirect('/library');
        }
    }
});

function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return yy + '-' + mm + '-' + dd;
}

module.exports = router;