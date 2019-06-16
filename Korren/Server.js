var express = require('express');
var bodyParser = require('body-parser')
var app = express(); // mediator
//"Realtime updates"
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose'); // 4 db
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
// for room
var ChorList = mongoose.model('Chores', {
    listName: String,
    tickets: [String],
    users: [String],
    userticketcolor: [String],
    YearnMonthnDay: String
})
module.exports = ChorList;
// for chatt
var Message = mongoose.model('Message', {
    name: String,
    message: String,
    chattroomid: String
})
const MongoClient = require('mongodb').MongoClient;
var db = mongoose.connection;
// Connection URL
const dbUrl = 'mongodb+srv://Broolarn:Hej123@korrencluster-pclxt.mongodb.net/messages';
app.get('/Chores', (req, res) => {
    //console.log(req.query.Email) // which mejl that content is gotten for
    console.log("getchores")
    ChorList.find({
        users: req.query.Email
    }, (err, Chores) => {
        res.send(Chores);
    })
})
app.post('/Delete', (req, res) => {
    console.log("Delete")
    // deletes the one with matching id
    ChorList.deleteOne({
        "_id": req.body._id
    }, (err, Chores) => {
        if (err) {
            console.log("Something wrong when deleting data!");
        }
    })
    io.emit('removed', req.body)
    Message.deleteMany({ chattroomid: req.body._id }, function(err, docs) {});
})
app.post('/Update', (req, res) => {
    console.log("update")
    var stringlist = new Array();
    if (req.body.tickets[0]) {
        req.body.tickets.forEach(function(entry) {
            stringlist.push(entry.title);
        });
    } else {
        req.body.tickets.forEach(function(entry) {
            stringlist.push(entry);
        });
    }
    ChorList.findOneAndUpdate({
        "_id": req.body._id
    }, {
        listName: req.body.listName,
        tickets: stringlist,
        users: req.body.users,
        userticketcolor: req.body.userticketcolor,
        YearnMonthnDay: req.body.YearnMonthnDay
    }, {
        new: true
    }, (error, doc) => {
        if (error) {
            console.log("Something wrong when updating data!");
        }
        // cause emit() to be called on actual socket instance
        io.emit('update', doc)
    });
})
app.post('/Chores', (req, res) => {
    console.log("addnew")
    var stringlist = [];
    stringlist.push(req.body.tickets[0].title);
    var chore = new ChorList(req.body);
    chore.tickets = stringlist;
    chore.userticketcolor = req.body.userticketcolor;
    chore.YearnMonthnDay = req.body.YearnMonthnDay;
    chore.save((err) => {
        console.log("chore" + chore)
        if (err) {
            // ...
            io.emit('chore', chore);
            sendStatus(500);
        }
        io.emit('add', chore);
        res.status(200).send(chore)
    })
})
/******************************************
 *                  messegess              *
 *                                         *
 *******************************************/
app.get('/messages', (req, res) => {
    Message.find({ chattroomid: req.query.chattroomid }, (err, messages) => {
        res.send(messages);
    })
})
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.chattroomid = req.body.chattroomid;
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', message);
        res.sendStatus(200);
    })})
io.on('connection', () => {
    console.log('a user is connected')
})
console.log(dbUrl)
mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})

