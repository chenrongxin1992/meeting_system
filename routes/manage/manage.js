var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger
var logic = require('../../logic/logic')

//http://localhost:3000/manage/add_meeting_room
router.get('/add_meeting_room',function(req,res){
	res.render('manage/add_meeting_room')
})
router.post('/add_meeting_room',function(req,res){
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
//apply
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
//register
router.get('/register',function(req,res){
	res.render('manage/register')
})
//register
router.get('/login',function(req,res){
	res.render('manage/login')
})
//for apply test
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