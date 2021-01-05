var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var server = express();

server.use(morgan("dev"));
server.use(bodyParser.json());
server.use(cors());
PORT = process.env.PORT || 5000;


let dbURI = "mongodb+srv://azhar:azhar@mongodb.xd2iy.mongodb.net/testDB?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
})

var userModel = mongoose.model("users", userSchema);

server.post("/signup", (req, res, next) => {

    userReq = req.body;
    console.log(userReq);
    if (!userReq.userEmail && !userReq.userPassowrd && !userReq.userName ) {
        res.send(JSON.stringify(userReq));
        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "Azhar",
                "email": "azhar@gmail.com",
                "password": "abc",
            }`)
        return;
    }

    var newUser = new userModel({
        "userName": req.body.userName,
        "userPassword": req.body.userPassword,
        "userEmail": req.body.userEmail,
    })

    newUser.save((err, data) => {
        if (!err) {
            res.send("user created")
        } else {
            console.log(err);
            res.status(500).send("user create error, " + err)
        }
    });
})




server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})

