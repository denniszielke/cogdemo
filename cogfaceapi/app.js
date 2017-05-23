
var express = require('express');
var bodyParser = require('body-parser')
var faceapis = require('./faceapis.js')

var app = express();
app.set("port", process.env.PORT || 8083);

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

app.get("/", function (req, res) {
    console.log("hello world")
    res.end("hello world");
});

app.post("/idimgface", function (req, res) {
    console.log("triggering face id");
    console.log(req.headers);
    var body = { 'url' : 'https://dzfaces.blob.core.windows.net/originals/' + req.headers.url };
    // res.end(JSON.stringify(body));
    faceapis.idface(body, function (result) {
        console.log("returning response");
        res.end(result);
    });
});

app.post("/groupfaces", function (req, res) {
    console.log("triggering face grouping");
    console.log(req.headers);
    var body = "{ \"faceIds\":  [ " + req.headers.ids + " ] }";
    // res.end(JSON.stringify(body));
    faceapis.groupfaces(body, function (result) {
        console.log("returning response");
        res.end(result);
    });
});

app.listen(app.get("port"), function () {
    console.log("Listening on port", app.get("port"));
});
