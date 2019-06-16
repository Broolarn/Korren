const mongoose = require('mongoose');
const dbUrl = 'mongodb+srv://Broolarn:Hej123@korrencluster-pclxt.mongodb.net/messages';

mongoose.Promise = global.Promise;

// connect before test
before(function(done){
	mongoose.connect(dbUrl)

	mongoose.connection.once('open',function(){
		console.log('connections has been made');
		done();
	}).on('error',function(error){
	 	console.log('mongodb connected2', err);
	});

});

