/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   后台所有路由
 */
var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger
var logic = require('../../logic/logic')

//get method : for render a page 
//post method : for ajax add meeting room 
router.get('/add_meeting_room',function(req,res){
	res.render('manage/add_meeting_room')
}).post('/add_meeting_room',function(req,res){
	console.log('----- add_meeting_room -----')

	var room_name = req.body.room_name
	if(!room_name){
		return res.json({'errMsg':'会议室编号或名称不能为空！'})
	}
	logic.add_meeting_room(room_name,function(result){
		if(result){
			return res.json({'data':result})
		}
	})
})
//for apply a new meeting room
router.post('/apply',function(req,res){
	console.log('----- apply -----')
	var room_name = req.body.room_name,
		meeting_name = req.body.meeting_name,
		meeting_num = req.body.meeting_num,
		meeting_content = req.body.meeting_content,
		apply_name = req.body.apply_name,
		apply_phone = req.body.apply_phone,
		meeting_date = req.body.meeting_date,
		meeting_time = req.body.meeting_time,
		exact_meeting_time = req.body.exact_meeting_time
	logic.apply(room_name,meeting_name,meeting_num,meeting_content,meeting_date,meeting_time,apply_name,apply_phone,exact_meeting_time,function(err,result){
		if(err){
			return res.json({'errCode':-1,'errMsg':err.message})
		}
		if(result == 1){
			return res.json({'errCode':-1,'errMsg':'该时间段已被占用，不能申请!'})
		}
		console.log('----- reply in router -----')
		console.log(result)
		return res.json({'errCode':0,'data':result})
	})
})

//get method : for render a login page 
//post method : for ajax to check login 
router.get('/login',function(req,res){
	res.render('manage/login')
}).post('/login',function(req,res){
	console.log('----- check login -----')
	let username = req.body.username,
		password = req.body.password
	logic.checkLogin(username,password,function(error,result){
		console.log('error is ',error)
		console.log('result is ',result)
		if(error && result == 1){
			console.log('---- 用户不存在 -----')
			return res.json({'errCode':-1,'errMsg':'用户不存在'})
		}
		if(error && result == null){
			console.log('----- 出错 -----')
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		if(error == null ){
			console.log('----- 登录成功 -----')
			console.log(result)
			req.session.user = result
			console.log('----- check session content -----')
			console.log(req.session.user)
			return res.json({'errCode':0,'errMsg':'success'})
		}
	})
})
//render a approve page for admin
router.get('/approve',function(req,res){
	console.log('----- in approve router -----')
	console.log('check session ',req.session.user)
	if(!req.session.user){
		console.log('----- user not login -----')
		return res.redirect('/manage/login')
	}
	return res.render('manage/approve',{username:req.session.user.username})
})
//render a logout page
router.get('/logout',function(req,res){
	console.log('----- in router logout -----')
	req.session.user = null;
    req.session.error = null;
    res.redirect("/manage/login");
})
//post method : ajax for add admin user 
//get method : render a page to add admin user 
router.post('/addAdminUser',function(req,res){
	let username = req.body.username,
		password = req.body.password
	if(!username || typeof username == 'undefined'){
		return res.json({'errCode':-1,'errMsg':'username can not be null'})
	}
	if(!password || typeof password == 'undefined'){
		return res.json({'errCode':-1,'errMsg':'password can not be null'})
	}
	logic.addAdminUser(username,password,function(error,result){
		if(error && result != 1){
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		if(error && result == 1){
			return res.json({'errCode':-1,'errMsg':'该用户已存在'})
		}
		return res.json({'errCode':0,'errMsg':'添加用户成功'})
	})
}).get('/addAdminUser',function(req,res){
	let username = req.body.username,
		password = req.body.password
		username = 'liyali'
		password = 'liyali'
	if(!username || typeof username == 'undefined'){
		return res.json({'errCode':-1,'errMsg':'username can not be null'})
	}
	if(!password || typeof password == 'undefined'){
		return res.json({'errCode':-1,'errMsg':'password can not be null'})
	}
	logic.addAdminUser(username,password,function(error,result){
		if(error && result == null){
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		if(error && result == 1){
			return res.json({'errCode':-1,'errMsg':'该用户已存在'})
		}
		if(result && result.length != 0)
			return res.json({'errCode':0,'errMsg':'添加用户成功'})
	})
})
//render a page for admin user to check apply
router.get('/applyApprove',function(req,res){
	//获取分页参数
	let limit = req.query.limit, 	//这个相当于条数
		offset = req.query.offset 	//这个相当于pages
	if(!limit || limit == null || typeof limit == 'undefined'){//页面记录数
		limit = 10
	}
	if(!offset || offset == null || typeof offset == 'undefined'){//当前页数
		offset = 0
	}
	offset = parseInt(offset/limit)
	console.log('----- in router applyApprove -----')
	console.log('check limit && offset: ',limit,offset)

	logic.applyApprove(limit,offset,function(error,result){
		if(error && result == null){//查询出错
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		else if(error && result == 1){
			return res.json({'errCode':-1,'errMsg':'当前没有记录'})
		}
		else{//(error == null && result)
			let total = result.length,
				rows = result
			console.log('total is ',result.total)
			//console.log('rows is ',result.docs)
			console.log('offset is ',result.offset)
			return res.json({total:result.total,rows:result.docs,offset:result.offset})
		}
	})
})
//ajax to get apply detail and put on bootstrap modal
router.post('/applyDetail',function(req,res){
	let _id = req.body._id
	console.log('----- in applyDetail router -----')
	console.log('_id: ',_id)
	logic.applyDetail(_id,function(error,result){
		if(error && result == null){
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		if(error && result == 1){
			return res.json({'errCode':-1,'errMsg':'没有该记录'})
		}
		if(result && result != 1){
			return res.json({'errCode':0,'errMsg':'success','result':result})
		}
	})
})
//ajax for update apply status
router.post('/updateApprove',function(req,res){
	let _id = req.body._id,
		is_approved = req.body.is_approved
	logic.updateApprove(_id,is_approved,function(error,result){
		if(error){
			console.log('----- router error -----')
			console.log(error.message)
			return res.json({'errCode':-1,'errMsg':error.message})
		}
		return res.json({'errCode':0,'errMsg':'success'})
	})
})
//just for apply test postman 
router.post('/test_apply',function(req,res){
	console.log('----- apply test -----')
	var room_name = req.body.room_name,
		meeting_name = req.body.meeting_name,
		meeting_num = req.body.meeting_num,
		meeting_content = req.body.meeting_content,
		apply_name = req.body.apply_name,
		apply_phone = req.body.apply_phone,
		meeting_date = req.body.meeting_date,
		meeting_time = req.body.meeting_time
	logic.test_apply(room_name,meeting_name,meeting_num,meeting_content,meeting_date,meeting_time,apply_name,apply_phone,function(err,result){
		if(err){
			return res.json({'err':err.message})
		}
		if(result == 1){
			return res.json({'Msg':'已有批准记录，不能申请'})
		}
		return res.json(result)
	})
})
module.exports = router