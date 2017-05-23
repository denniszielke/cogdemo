var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var http = require('http');

function FaceList(faceDao, faceIdHost, faceIdHostPort) {
  this.faceDao = faceDao;
  this.faceIdHost = faceIdHost;
  this.faceIdHostPort = faceIdHostPort;
}

module.exports = FaceList;
FaceList.prototype = {
    showFaces: function (req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM c WHERE c.age > 0',
        };

        self.faceDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }

            res.render('index', {
                title: 'All scanned faces ',
                faces: items
            });
        });
    },

    showScans: function (req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT Top 1 * FROM c where c.scan = true order by c.date desc',
        };

        self.faceDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            console.log(items[0].groupings);
            res.render('scan', {
                title: 'We grouped the scans... ',
                scans: items[0].groupings
            });
        });
    },

    addFace: function (req, res) {
        var self = this;
        var item = req.body;

        if (!(item.name && item.fileName))
        {
            return;
        }

        console.log("receiving request for " + item.name + " fileName " + item.fileName);

        var body = { 'url': item.fileName };
        var post_options = {
            host: self.faceIdHost,
            port: self.faceIdHostPort,
            path: '/idimgface',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                'url': item.fileName
            }
        };        
        console.log('Posting body');
        console.log(body);

        var post_req = http.request(post_options, function (res2) {
            res2.on('data', function (chunk) {
                var face = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(chunk)))[0];
                console.log('Response: ' + face);
                if (!face)
                {
                    res.redirect('/');
                }

                console.log(face.faceId);
                var detectedResult = { 'id' : face.faceId, 'img': item.fileName, 'name': item.name, 'gender': face.faceAttributes.gender, 'age': face.faceAttributes.age, 'smile': face.faceAttributes.smile, 'glasses': face.faceAttributes.glasses };
                console.log('adding face ');
                console.log(detectedResult);
                self.faceDao.addItem(detectedResult, function (err) {
                    if (err) {
                        throw (err);
                    }

                    res.redirect('/');
                });
            });
            
        });
        
        post_req.on('error', function (error) {
            console.log(error);
        });
        
        // post the data
        post_req.write(JSON.stringify(body));
        post_req.end();        
    },

    triggerScan: function (req, res) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM c WHERE c.age > 0',
        };

        var lookUpFaces = {};

        self.faceDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            
            var faceids = "";
            for (i = 0; i < items.length; i++) { 
                lookUpFaces[items[i].id] = items[i];
                if (faceids.length>0)
                {
                    faceids += ","
                }
                faceids += "\"" + items[i].id + "\"";
            }

            console.log(faceids);

            console.log("receiving request for faceids " + faceids);

            var body = { 'ids': faceids };
            var post_options = {
                host: self.faceIdHost,
                port: self.faceIdHostPort,
                path: '/groupfaces',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                    'ids': faceids
                }
            };        
            console.log('Posting body');
            console.log(body);

            var post_req = http.request(post_options, function (res2) {
                res2.on('data', function (chunk) {
                    var result = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(chunk)));
                    console.log('Response: ' + result);
                    if (!result)
                    {
                        res.redirect('/');
                    }
                    result.scan = true;
                    console.log('adding grouping ');
                    console.log(result);
                    var groupings = [];
                    result.groups.forEach(function(group) {
                        if(group && group.length > 0){
                            var grouping = [];
                            group.forEach(function(element) {
                                grouping.push( lookUpFaces[element] );
                            }, this);
                            groupings.push(grouping);
                        }
                    }, this);
                    result.groupings = groupings;
                    self.faceDao.addItem(result, function (err) {
                        if (err) {
                            throw (err);
                        }
                        res.redirect('/');
                    });
                });
                
            });
            
            post_req.on('error', function (error) {
                console.log(error);
            });
            
            // post the data
            post_req.write(JSON.stringify(body));
            post_req.end();   
        });
    }
};