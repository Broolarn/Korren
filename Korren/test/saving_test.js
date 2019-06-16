const mocha = require('mocha');
const assert = require('assert')
const Chorelist  = require('../Server.js')

// describe tests
describe('Saving record', function(){

	//insert tests
	it('Save a record to the database',function(done){

		var chore = new Chorelist({
			    listName: 'testname',
			    tickets: ['chore1','chore2'],
			    users: ['tempuser@gmail.com'],
			    userticketcolor: '#FFFFFF',
			    YearnMonthnDay: '2019-06-07'
		});
		chore.save().then(function(){
			assert(chore.isNew === false)
			
		done();
		});
	});
});