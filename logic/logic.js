const meeting_room = require('../db/meeting_room')
const async = require('async')

exports.add_meeting_room = function(room_name,callback){
	async.waterfall([
		function(cb){//check the if the record is existed
			meeting_room.find({'room_name':room_name},function(err,doc){
				if(err){
					console.log('----- search err -----')
					console.error(err)
					cb(err)
				}
				if(doc){
					console.log('----- room_name is existed -----')
					cb(doc)
				}
				if(!doc){
					console.log('----- room_name is not existed -----')
					cb(null)
				}
			})
		},
		function(cb){

		}
	],function(err,result){

	})
	
}