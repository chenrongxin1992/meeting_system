const meeting_room = require('../db/meeting_room')
const apply = require('../db/apply')
const admin = require('../db/admin')
const async = require('async')
const moment = require('moment')
const chunk =require("lodash/chunk")
const nodemailer = require('nodemailer')

var config_email = {
	host : 'smtp.qq.com',
	secureConnection: true,
	auth : {
		user : '848536190@qq.com',
		pass : 'eerjruzzkiaxbfcg'
	}
}
var transporter = nodemailer.createTransport(config_email)

var data = {
	from : '848536190@qq.com',
	to : '',
	subject : '计算机与软件学院 会议室申请结果 通知',
	html : ''
}


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
		else if(err && !result){
			console.log('----- async err -----')
		}
		else{
			console.log('----- final result -----')
			console.log(result)
			callback(result)
		}
	})
	
}
//返回一周会议室申请记录
exports.apply_record = function(week,callback){
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
				if(docs && docs.length != 0){
					console.log('meeting_room: ',docs)
					cb(null,docs)
				}
			})
		},
		function(docs,cb){
			var list = new Array(),
				resultList = new Array()
			async.eachLimit(docs,1,function(item,cbb){
				console.log('----- check each docs -----')
				console.log(item)
				list.push(item.room_name)
				var dateArr = new Array()
					dateArr.push(moment().add(week,'week').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(1,'days').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(2,'days').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(3,'days').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(4,'days').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(5,'days').format('MM月DD日'))
					dateArr.push(moment().add(week,'week').add(6,'days').format('MM月DD日'))

				console.log('dateArr:',dateArr)

				async.eachLimit(dateArr,1,function(val,cbbb){
					console.log('----- check dateArr val -----')
					console.log(val)
					var timeArr = new Array()
						timeArr.push('上午')
						timeArr.push('中午')
						timeArr.push('下午')
						timeArr.push('晚上')
					console.log('timeArr:',timeArr)
					async.eachLimit(timeArr,1,function(v,cbbbb){
						console.log('----- check timeArr val -----')
						//console.log(v)
						console.log('meeting_date && meeting_time && room_name',val,v,item.room_name)
						apply.find({'meeting_date':val,'meeting_time':v,'room_name':item.room_name},function(err,doc){
							if(err){
								console.log('----- search err -----')
							}
							if(!doc || doc.length ==0){
								console.log('----- doc is null -----')
								list.push('0')
								cbbbb()
							}
							if(doc && doc.length != 0) {
								var temp = '1'
								for(let k=0;k<doc.length;k++){
									//console.log(doc)
									if(doc[k].is_approved == 1){//有批准记录
										console.log('----- has is_approved -----')
										temp = '2'
									}
								}
								list.push(temp)
								cbbbb()
							}
						})
					},function(err){
							if(err){
								console.log('----- each timeArr err -----')
							}
							//console.log('list:',list)
							console.log('----- each timeArr finish -----')
							console.log('list length',list.length)
							//分割结果
							resultList = chunk(list,29)
							cbbb()		
					})
				},function(err){
					if(err){
						console.log('----- each dateArr err -----')
					}
					//resultList.push(list)
					//console.log('resultList:',resultList)
					console.log('----- each week days finish -----')
					console.log('resultList length',resultList.length)
					cbb()
				})
			},function(err){
				if(err){
					console.log('----- each docs err -----')
				}
				console.log('----- async waterfall finish -----')
				//console.log('resultList: ',resultList)
				cb(null,resultList)
			})
		}
	],function(err,result){
		if(err && err == 1){
			console.log('----- async err and result is null -----')
			callback(null)
		}
		else if(err && err != 1){
			console.log('----- async err -----')
			console.log(err.message)
		}
		else{
			console.log('----- async end and final result is -----')
			console.log(result)
			callback(result)
		}
	})
}
//获取点击查看申请详情
exports.get_meeting_detail = function(week,room_name,meeting_date,meeting_time,callback){
	console.log('check args: ',room_name,meeting_date,meeting_time)
	apply.find({'room_name':room_name,'meeting_date':meeting_date,'meeting_time':meeting_time},function(err,docs){
		if(err){
			console.log('----- find err -----')
			callback(err)
		}
		if(!docs || docs.length == 0){
			console.log('----- docs is null -----')
			return callback()
		}
		console.log('----- check docs -----')
		console.log(docs)
		callback(null,docs)
	})
}
//获取会议室，返回前端select
exports.select_room = function(callback){
	meeting_room.find({},function(err,docs){
		if(err){
			console.log('----- search err -----')
			callback(err)
		}
		if(!docs || docs.length == 0){
			console.log('----- docs is null -----')
			callback(1,null)
		}
		console.log(docs)
		let room_arr = new Array()
		for(let i=0;i<docs.length;i++){
			room_arr.push(docs[i].room_name)
		}
		console.log('----- check room_arr -----')
		console.log(room_arr)
		callback(null,room_arr)
	})
}
//添加申请记录
exports.apply = function(room_name,meeting_name,meeting_num,meeting_content,meeting_date,meeting_time,apply_name,apply_phone,exact_meeting_time,apply_email,callback){
	async.waterfall([
		function(cb){//检查该时间段会议室是否已被批准使用
			apply.find({'room_name':room_name,'meeting_date':meeting_date,'exact_meeting_time':exact_meeting_time,'is_approved':1},function(err,doc){
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
				apply_phone : apply_phone,
				exact_meeting_time : exact_meeting_time,
				apply_time : moment().format('YYYY-MM-DD HH:mm:ss'),
				email :apply_email
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
exports.addAdminUser = function(username,password,callback){
	admin.find({'username':username},function(err,doc){
		if(err){
			console.log('----- search err -----')
			callback(err,null)
		}
		if(!doc || doc.length == 0){
			console.log('----- username is not existed and can be add -----')
			let newUser = new admin({
				username : username,
				password : password
			})
			console.log('new adminUser: ',newUser)
			newUser.save(function(error,doc){
				if(error){
					console.log('----- save err -----')
					callback(error)
				}
				console.log('----- save success -----')
				callback(null,doc)
			})
		}
		if(doc && doc.length != 0){
			console.log('----- username is existed -----')
			callback(1,1)
		}
	})
}
//checkLogin
exports.checkLogin = function(username,password,callback){
	async.waterfall([
		function(cb){
			admin.find({'username':username},function(err,doc){
				if(err){
					console.log('----- search err -----')
					cb(err,null)
				}
				if(!doc || doc.length == 0){
					console.log('----- username not existed -----')
					cb(1,1)
				}
				if(doc && doc.length != 0){
					console.log('----- check admin detail -----')
					console.log(doc)
					cb(null,doc[0])
				}
			})
		},
		function(doc,cb){
			if(doc.password == password){
				console.log('----- login confirm -----')
				cb(null,doc)
			}
		}
	],function(err,result){
		if(err && result == 1){
			console.log('----- admin not existed -----')
			callback(1,1)
		}
		if(err && result == null){
			console.log('----- async err -----')
			callback(err,null)
		}
		if(err == null){
			console.log('----- final check -----')
			callback(null,result)
		}
		
	})
}
//get apply for approve 'room_name,meeting_name,exact_meeting_time,meeting_content,meeting_num,apply_name,apply_phone,is_approved'
exports.applyApprove = function(limit,offset,username,callback){
	console.log('session username is -->',username)
	if(username == 'admin1'){
		var room_name_arr = ['计软624会议室','计软623会议室']
	}
	else if(username == 'admin2'){
		var room_name_arr = ['报告厅']
	}
	else{
		var room_name_arr = ['计软624会议室','计软623会议室','报告厅','计软1019会议室','计软938会议室','计软407会议室']
	}
	console.log('check room_name_arr -->',room_name_arr)

	async.waterfall([
		function(cb){
			let query = apply.find({})
				query.where('room_name').in(room_name_arr)
				query.exec(function(err,docs){
					if(err){
						console.log('----- search err -----')
						console.log(err.message)
						cb(err,null)
					}
					if(!docs || docs.length == 0){
						console.log('----- no result now -----')
				 		cb(1,1)
					}
					if(docs && docs.length !=0){
						cb(null,docs.length)
					}
				})
			// apply.find({},function(err,docs){
			// 	if(err){
			// 		console.log('----- search err -----')
			// 		console.log(err.message)
			// 		cb(err,null)
			// 	}
			// 	if(!docs || docs.length == 0){
			// 		console.log('----- no result now -----')
			// 		cb(1,1)
			// 	}
			// 	if(docs && docs.length !=0){
			// 		//console.log('check apply records: ',docs)
			// 		cb(null,docs.length)
			// 	}
			// })
		},
		function(length,cb){
			console.log('total length: ',length)
			limit = parseInt(limit)
			offset = parseInt(offset)
			let numSkip = (offset)*limit
			console.log('skip num is: ',numSkip)
			let search = apply.find({},{'room_name':1,'meeting_name':1,'meeting_date':1,'exact_meeting_time':1,'meeting_content':1,'apply_time':1,'meeting_num':1,'apply_name':1,'apply_phone':1,'is_approved':1,'_id':1 })
				search.where('room_name').in(room_name_arr)
				search.sort({'apply_time':-1})
				search.limit(limit)
				search.skip(numSkip)
				search.exec(function(err,docs){
					if(err){
						console.log('----- search err -----')
						console.log(err.message)
						cb(err,null)
					}
					if(!docs || docs.length == 0){
						console.log('----- no result now -----')
						cb(1,1)
					}
					if(docs && docs.length !=0){//格式化并将length加入
						for(let i=0;i<docs.length;i++){
							//格式化时间戳
							//docs[i].apply_time = moment(docs[i].apply_time).format('YYYY-MM-DD HH:mm:ss')
							//console.log('check applytime : ',docs[i].apply_time)
							docs[i].exact_meeting_time = docs[i].meeting_date + ' ' + docs[i].exact_meeting_time
							console.log('docs.is_approved: ',docs[i].is_approved)
							if(docs[i].is_approved == 1){
								console.log('--- check here -----')
								docs[i].is_approved = '已批准'
								console.log(docs[i].is_approved)
							}
							else{
								console.log('----- check here hrere -----')
								docs[i].is_approved = '未批准'
							}
						}

						 docs = {
						 	total : length,
						 	docs : docs,
						 	offset : offset
						 }
						 cb(null,docs)
					}
				})
		}],function(err,result){
			if(err && result == 1){
				console.log('----- async no records -----')
				callback(err,1)
			}
			else if(err && result == null){
				console.log('----- async err -----')
				callback(err,null)
			}
			else{//(result && result.length != 0)
				console.log('----- async final result -----')
				callback(null,result)
			}
	})
}
exports.applyApproveQuery = function(limit,offset,begin_date,end_date,username,callback){
	console.log('session username is -->',username)
	if(username == 'admin1'){
		var room_name_arr = ['计软624会议室','计软623会议室']
	}
	else if(username == 'admin2'){
		var room_name_arr = ['报告厅']
	}
	else{
		var room_name_arr = ['计软624会议室','计软623会议室','报告厅','计软1019会议室','计软938会议室','计软407会议室']
	}
	console.log('check room_name_arr -->',room_name_arr)

	//如果begin_date为空，取默认值2017-01-01,end_time为空，取当前时间戳
	if(!begin_date || typeof begin_date == 'undefined'){
		begin_date = moment('2017-01-01','YYYY-MM-DD').format('X')
		console.log('begin_date is null')
		console.log('check begin_date timeStamp',begin_date)
	}else{
		console.log('begin_date is not null')
		begin_date = moment(begin_date,'YYYY-MM-DD').format('X')
		console.log('check begin_date timeStamp',begin_date)
	}
	if(!end_date || typeof end_date == 'undefined'){
		end_date = moment().format('X')
		console.log('end_date is null ')
		console.log('check end_date timeStamp',end_date)
	}else{
		end_date = moment(end_date,'YYYY-MM-DD').add(1,'days').format('X')
		console.log('end_date is not null')
		console.log('check end_date timeStamp',begin_date)
	}
	async.waterfall([
		function(cb){
			let search = apply.find({})
				search.where('room_name').in(room_name_arr)
				search.where('apply_timeStamp').gte(begin_date)
				search.where('apply_timeStamp').lte(end_date)
				search.where('is_approved').equals('1')
				search.exec(function(err,docs){
					if(err){
						console.log('----- search err -----')
						console.log(err.message)
						cb(err,null)
					}
					if(!docs || docs.length == 0){
						console.log('----- no result now -----')
						cb(1,1)
					}
					if(docs && docs.length !=0){
						console.log('check apply records that fetch condition: ',docs)
						cb(null,docs.length)
					}
				})
		},
		function(length,cb){
			console.log('check records length: ',length)
			limit = parseInt(limit)
			offset = parseInt(offset)
			let numSkip = (offset)*limit
			console.log('skip num is: ',numSkip)
			let secondSearch = apply.find({},{'room_name':1,'meeting_name':1,'meeting_date':1,'exact_meeting_time':1,'meeting_content':1,'apply_time':1,'meeting_num':1,'apply_name':1,'apply_phone':1,'is_approved':1,'_id':1})
				secondSearch.where('room_name').in(room_name_arr)
				secondSearch.where('apply_timeStamp').gte(begin_date)
				secondSearch.where('apply_timeStamp').lte(end_date)
				//secondSearch.select()
				secondSearch.where('is_approved').equals('1')
				secondSearch.sort({'apply_time':-1})
				secondSearch.limit(limit)
				secondSearch.skip(numSkip)
				secondSearch.exec(function(err,docs){
					if(err){
						console.log('----- search err -----')
						console.log(err.message)
						cb(err,null)
					}
					if(!docs || docs.length == 0){
						console.log('----- no result now -----')
						cb(1,1)
					}
					if(docs && docs.length != 0){
						for(let i=0;i<docs.length;i++){
							docs[i].exact_meeting_time = docs[i].meeting_date + ' ' + docs[i].exact_meeting_time
							console.log('docs.is_approved: ',docs[i].is_approved)
							if(docs[i].is_approved == 1){
								console.log('--- check here -----')
								docs[i].is_approved = '已批准'
								console.log(docs[i].is_approved)
							}
							else{
								console.log('----- check here hrere -----')
								docs[i].is_approved = '未批准'
							}
						}
						docs = {
							 	total : length,
							 	docs : docs,
							 	offset : offset
							 }
						cb(null,docs)
					}
				})
		}
	],function(err,result){
		if(err && result == 1){
			console.log('----- async no records -----')
			callback(err,1)
		}
		else if(err && result == null){
			console.log('----- async err -----')
			callback(err,null)
		}
		else{//(result && result.length != 0)
			console.log('----- async final result -----')
			callback(null,result)
		}
	})
}
//applyDetail
exports.applyDetail = function(_id,callback){
	apply.findOne({'_id':_id},function(err,doc){
		if(err){
			console.log('----- search err -----')
			console.log(e.message)
			callback(err,null)
		}
		if(!doc || doc.length == 0){
			console.log('----- no result -----')
			callback(1,1)
		}
		if(doc && doc.length != 0){
			console.log('----- check doc -----')
			console.log(doc)
			callback(null,doc)
		}
	})
}
//updateApprove
exports.updateApprove = function(_id,is_approved,callback){
	//{$set:{name:'MDragon'}}
	apply.update({'_id':_id},{$set:{'is_approved':is_approved}},function(err){
		if(err){
			console.log('----- update err -----')
			console.log(err.message)
			callback(err,null)
		}
		console.log('----- update success -----')
		//find this record and send a email
		apply.findOne({'_id':_id},function(err,doc){
			if(err){
				console.log('----- search err -----')
				console.log(err.message)
			}else{
				let sendTo = doc.email
				console.log('check email: ',sendTo)
				data.to = sendTo
				data.html = '您好，你申请的 <strong>'+doc.room_name+' </strong>已通过审批,会议时间: <strong style="color:red">' + doc.meeting_date + ' ' + doc.exact_meeting_time + '</strong>。'
				console.log('check send data: ',data)
				transporter.sendMail(data,function(err,info){
					if(err){
						console.log('----- send email err -----')
						console.log(err.message)
					}else{
						console.log('message sent: ',info.response)
						callback(null)
					}
				})
			}
		})
		//callback(null)
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
				apply_phone : apply_phone,
				apply_timeStamp : moment().format('X')
			})
			console.log('new_apply: ',new_apply)
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
