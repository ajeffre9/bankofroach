var express = require("express");
var router = express.Router();
var async = require("async");

// Require the driver.ujsavdvfdas
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgresql://root@10.132.0.2:26257?sslmode=disable';
var client = new pg.Client(connectionString);

/******
INSERT
******/
router.post('/insert', function(req, res){

body = req.body;// JSON.parse(req.body);
	try{
	    // Grab data from http request
	    var data = {username: body.username, filename: body.filename, location: body.location, url: body.url};
	    console.log("Testing: "+JSON.stringify(data));
	    // Get a Postgres client from the connection pool
	    pg.connect(connectionString, function(err, client, done) {
	        // Handle connection errors
	        if(err) {
	          done();
	          console.log(err);  
	          return res.status(500).json({ success: false, data: err});
	        }


	        // Insert customer
	        client.query("INSERT INTO koala.files (username, filename, location, url, data) VALUES($1, $2, $3, $4, $5);", [data.username, data.filename, data.location, data.url, data.data], function (err, result) {
				done();
				res.send();

			    if (err) {
			      return console.error('error happened during query', err)
			    }
			});
		});
	} catch (ex) {
	    callback(ex);
	}
});

/******
FILE RECOVERY
******/
router.get('/fetch', function(req, res){

	try{
	    // Get a Postgres client from the connection pool
	    pg.connect(connectionString, function(err, client, done) {
	        // Handle connection errors
	        if(err) {
	          done();
	          console.log(err);
	          return res.status(500).json({ success: false, data: err});
	        }
	        console.log("<<<<<");
        	console.log(req.headers.username);
        	console.log(">>>>>");

	        var query = client.query("SELECT * FROM koala.files WHERE username = $1;",  [req.headers.username], function (err, result) {
			    if (err) {
			    	console.log(err);
			      throw (err);
			    }
			    console.log("RESULT: "+JSON.stringify(result.rows));
			    res.send(result.rows);
			});

        	query.on('error', function(err) {
	          console.log(err);
	          res.status(500).json({ success: false, data: err});
	          done();
        	});

		});
	} catch (ex) {
	    callback(ex);
	}
});

/******
MORE MONEY
******/



module.exports = router;