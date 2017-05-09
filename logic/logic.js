const meeting_room = require('../db/meeting_room')
const apply = require('../db/apply')
const async = require('async')

exports.add_meeting_room = function(room_name,callback){
	async.waterfall([
		function(cb){//check the if the record is existed
			meeting_room.find({'room_name':room_name},function(err,doc){
				if(err){
					console.log('----- search err -----')
					console.error(err)
					return cb(err)
				}
				if(!doc){
					console.log('----- room_name is not existed -----')
					return cb(null)
				}
				if(doc.length == 0){
					console.log('----- room_name is not existed -----')
					return cb(null)
				}
				if(doc){
					console.log('----- room_name is existed -----')
					console.log(doc)
					return cb(1,doc)
				}
				//cb(null)
			})
		},
		function(cb){
			var room = new meeting_room({
				room_name:room_name
			})
			room.save(function(err,doc){
				if(err){
					console.log('----- add err -----')
					console.error(err)
					cb(err)
				}
				console.log('----- add success -----')
				return cb(null,doc)
			})
		}
	],function(err,result){
		if(err && result){
			console.log('----- room_name is existed -----')
			callback(1)
		}
		if(err && !result){
			console.log('----- async err -----')
		}
		console.log('----- final result -----')
		console.log(result)
		callback(result)
	})
	
}

//测试添加申请记录
exports.test_apply = function(room_name,meeting_name,meeting_num,meeting_content,meeting_date,meeting_time,apply_name,apply_phone,callback){
	async.waterfall([
		function(cb){//检查该时间段会议室是否已被批准使用
			apply.find({'room_name':room_name,'meeting_date':meeting_date,'meeting_time':meeting_time,'is_approved':1},function(err,doc){
				if(err){
					console.log('----- search err -----')
					console.error(err)
					return cb(err)
				}
				if(!doc || doc.length == 0){
					console.log('----- 没有申请 -----')
					cb(null)
				}
				if(doc && doc.length != 0){
					console.log('----- 已有批准记录 -----')
					console.log(doc)
					cb(1,doc)
				}
			})
		},
		function(cb){
			var new_apply = new apply({
				room_name : room_name,
				meeting_name : meeting_name,
				meeting_num : meeting_num,
				meeting_content : meeting_content,
				meeting_date : meeting_date,
				meeting_time : meeting_time,
				apply_name : apply_name,
				apply_phone : apply_phone
			})
			console.log(new_apply)
			new_apply.save(function(err,doc){
				if(err){
					console.log('----- save err -----')
					console.error(err)
					return cb(err)
				}
				console.log('---- save success -----')
				console.log('new_apply: ',doc)
				cb(null,doc)
			})
		}
	],function(err,result){
		if(err && result){
			console.log('----- 已有批准记录 -----')
			return callback(null,1)
		}
		if(err){
			console.log('----- async err -----')
			return callback(err)
		}
		callback(null,result)
	})
}