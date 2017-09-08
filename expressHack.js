/* express app as a webtask */
var MongoClient = require('mongodb').MongoClient;
var Express = require('express');
var wt = require('webtask-tools');
var app = Express();
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;

app.use(require('body-parser').json());

function doCRUD (crudType,req,res) {
  MongoClient.connect(req.webtaskContext.secrets.MONGO_URL,function (err, db) { 
     if (err) {
        res.send(JSON.stringify(err));
     } else {
       switch(crudType) {
        case 'GET':
         db.collection('tasklist').find({}).sort({"dateAdded" : -1}).toArray(function(err, docs) {
         if (err) {
            res.send(JSON.stringify(err));
         } else {
           res.end(JSON.stringify(docs));
         }
         }); //toArray   
         break;
        case 'POST':
         db.collection('tasklist').insertOne({"todo" :  req.query.todo, "dateAdded" : new Date()}, function(err, result) {
          assert.equal(null, err);
          assert.equal(1, result.insertedCount);
          res.end(JSON.stringify(result["ops"][0]._id));
         });
         break;
        case 'DELETE':
         db.collection('tasklist').deleteOne({_id: new ObjectId(req.query.id)},function(err){assert.equal(null,err); res.end();});
         break;
        case 'PUT':
        //not implemented for this hack
        break;
       }  
     }
 });
}
// GET
app.get('*', function (req, res) {
  doCRUD('GET',req,res);
});
// POST
app.post('*', function (req, res) {
  doCRUD('POST',req,res);
});
// DELETE
app.delete('*', function (req, res) {
  doCRUD('DELETE',req,res);
});

// expose this express app as a webtask-compatible function*/

module.exports = wt.fromExpress(app);
