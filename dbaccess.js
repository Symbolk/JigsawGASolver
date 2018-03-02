const config=require('./config');
var mongoose = require('mongoose');
const NodeModel = require('./model').Node;

/**
 * Utils to access the database
 */

/**
 * Get a database snapshot when computing the fitness
 */
var nodes;
var takeSnapshot = (round_id) => {
    NodeModel.find({round_id: round_id}).lean().exec(function(err, docs){
        if(err){
            console.log(err);
        }else{
            nodes=JSON.stringify(docs); // convert to json string
            console.log(nodes);
            return docs; // return mongo object
        }
    });
};

const DB_URL = config.database;
mongoose.Promise=require('bluebird');
mongoose.connect(DB_URL, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', function (err) {
    db.close();
    console.log('Mongoose connection error: ' + err);
});

// db.once('open', function () {
//     console.log('Mongoose connecting to ' + DB_URL);  
// });

// db.on('connected', function () {
//     console.log('Mongoose connected to ' + DB_URL);
// });

db.on('disconnected', function () {
    db.close();
    console.log('Mongoose connection disconnected');
});

module.exports={
    takeSnapshot:takeSnapshot,
    mongo:db
}
