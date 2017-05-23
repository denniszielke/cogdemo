'use strict';
var http = require('http');
var port = process.env.port || 1337;
var nodestat = require('node-static');

var file = new nodestat.Server('./public');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port);
