var config = {}

config.host = process.env.HOST || "https://cogresults.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "YMtBJYy9SWBcXK04ZQH11HX0HLiBdgSx6fTOErIUwBPijpXlYlgpIYshSe5VRmsgV109nJX2n1uorc8EkNS6Lg==";
config.databaseId = "faces";
config.collectionId = "faceScans";

config.faceIdHost = "cogfaceapi";
config.faceIdHostPort = 8083;

module.exports = config;
