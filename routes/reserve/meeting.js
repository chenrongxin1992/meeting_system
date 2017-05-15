/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   会议预定显示路由
 */
var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger
const logic = require('../../logic/logic')

/*
 * 显示会议室预定情况
 */
router.get('/meeting',function(req,res){
	var week = req.query.week
	console.log('----- router get week -----',week)
	if(typeof week == 'undefined' || week == null){
		week = 0
	}
	console.log('now week is : ',week)
	logic.apply_record(week,function(result){
		res.render('meeting',{result:result})
	})
})
/*
 * 会议室预定form
 */
router.get('/reserve',function(req,res){
	logic.select_room(function(err,result){
		if(err && result != null){
			return res.json({'err':err.message})
		}
		if(err && result == null){
			return res.json({'err':'no meeting_room now'})
		}
		res.render('reserve/reserve',{'data':result})
	})
})
/*
 * 获取会议室预定详情
 */
router.post('/get_meeting_detail',function(req,res){
	console.log('----- get_meeting_detail -----')
	var room_name = req.body.room_name,
		meeting_date = req.body.meeting_date,
		meeting_time = req.body.meeting_time,
		week = req.body.week
	if(typeof week == 'undefined' || week == null){
		week = 0
	}
	console.log('now week is : ',week)
	if(!room_name){
		return res.json({'Msg':'meeting_room can not be null'})
	}
	if(!meeting_date){
		return res.json({'Msg':'meeting_date can not be null'})
	}
	if(!meeting_time){
		return res.json({'Msg':'meeting_time can not be null'})
	}
	logic.get_meeting_detail(week,room_name,meeting_date,meeting_time,function(err,result){
		if(err){
			console.log('----- get_meeting_detail err -----')
			return res.json({'Msg':err.message})
		}
		if(result == null){
			return res.json(null)
		}
		return res.json(result)
	})
})
module.exports = router