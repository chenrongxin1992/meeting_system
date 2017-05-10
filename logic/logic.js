const meeting_room = require('../db/meeting_room')
const apply = require('../db/apply')
const async = require('async')
const moment = require('moment')

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
//返回一周会议室申请记录
exports.apply_record = function(callback){
	async.waterfall([
		function(cb){//获取所有会议室记录
			meeting_room.find({},'room_name',function(err,docs){
				if(err){
					console.log('----- search err -----')
					cb(err)
				}
				if(!docs || docs.length == 0){
					console.log('----- docs is null -----')
					cb(1)
				}
				console.log(docs)
				cb(null,docs)
			})
		},
		function(docs,cb){
			var list = new Array(),
				resultList = new Array()
			async.eachLimit(docs,1,function(item,cb){
				console.log('----- check each docs -----')
				console.log(item)
				list.push(item.room_name)
				var dateArr = new Array()
					dateArr.push(moment().format('M月DD日'))
					dateArr.push(moment().add(1,'days').format('M月DD日'))
					dateArr.push(moment().add(2,'days').format('M月DD日'))
					dateArr.push(moment().add(3,'days').format('M月DD日'))
					dateArr.push(moment().add(4,'days').format('M月DD日'))
					dateArr.push(moment().add(5,'days').format('M月DD日'))
					dateArr.push(moment().add(6,'days').format('M月DD日'))

				console.log('dateArr:',dateArr)

				async.eachLimit(dateArr,1,function(val,cbb){
					console.log('----- check dateArr val -----')
					console.log(val)
					var timeArr = new Array()
						timeArr.push('上午')
						timeArr.push('中午')
						timeArr.push('下午')
						timeArr.push('晚上')
					console.log('timeArr:',timeArr)
					async.eachLimit(timeArr,1,function(v,cbbb){
						console.log('----- check timeArr val -----')
						console.log(v)
						apply.find({'meeting_date':val,'meeting_time':v,'room_name':item.room_name,'is_approved':1},function(err,doc){
							if(err){
								console.log('----- search err -----')
							}
							else if(!doc || doc.length ==0){
								console.log('----- doc is null -----')
								list.push('0')
								cbbb()
							}
							else {
								list.push('1')
								cbbb()
							}
						})
					},function(err){
							if(err){
								console.log('----- each timeArr err -----')
							}
							console.log('list:',list)
							console.log('list length',list.length)
							cbb()		
					})
				},function(err){
					if(err){
						console.log('----- each dateArr err -----')
					}
					resultList.push(list)
					console.log('resultList:',resultList)
					console.log('resultList length',resultList.length)
					cb()
				})
			},function(err){
				if(err){
					console.log('----- each docs err -----')
				}
				console.log('----- final result -----')
				console.log('resultList: ',resultList[0])
				callback(resultList)
			})
		}
	],function(err,result){

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