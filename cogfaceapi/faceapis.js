var http = require('http');
var https = require('https');

exports.bytesToSize = function BytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

exports.groupfaces = function GroupFaces(faceIds, callback) {

    var facePayloads = JSON.parse(faceIds);
    var faceIdString = JSON.stringify(facePayloads);
    console.log("posting payload");
    console.log(faceIdString);

    // An object of options to indicate where to post to
    var post_options = {
        host: 'api.projectoxford.ai',
        path: '/face/v1.0/group',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(faceIdString),
            'Ocp-Apim-Subscription-Key': '75912c93756c49558319a8ce0b175bde'
        }
    };
    
    // Set up the request
    var post_req = https.request(post_options, function (res) {
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
        
    });
    
    post_req.on('error', function (error) {
        console.log(error);
    });
    
    // post the data
    post_req.write(faceIdString);
    post_req.end();

}

exports.postface = function PostFace(payload, payloadsize, callback) {

    // An object of options to indicate where to post to
    var post_options = {
        host: 'api.projectoxford.ai',
        path: '/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,glasses',
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': payloadsize,
            'Ocp-Apim-Subscription-Key': '75912c93756c49558319a8ce0b175bde'
        }
    };
    
    // Set up the request
    var post_req = https.request(post_options, function (res) {
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
        
    });
    
    post_req.on('error', function (error) {
        console.log(error);
    });

    post_req.write(payload);
    post_req.end();
}

exports.idface = function IdFace(payload, callback) {
    console.log("Posting file to cognitive services");
    console.log(payload);
    var payloadsize = Buffer.byteLength(JSON.stringify(payload));
    // An object of options to indicate where to post to
    var post_options = {
        host: 'api.projectoxford.ai',
        path: '/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,glasses',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payloadsize,
            'Ocp-Apim-Subscription-Key': '75912c93756c49558319a8ce0b175bde'
        }
    };
    
    // Set up the request
    var post_req = https.request(post_options, function (res) {
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
        
    });
    
    post_req.on('error', function (error) {
        console.log(error);
    });

    post_req.write(JSON.stringify(payload));
    post_req.end();
}