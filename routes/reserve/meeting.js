var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger
const logic = require('../../logic/logic')

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
// router.post('/add_meeting_room',function(req,res){
// 	console.log('----- add_meeting_room -----')

// })
router.get('/reserve',function(req,res){
	res.render('reserve/reserve')
})
//请求申请记录详情
router.post('/get_meeting_detail',function(req,res){
	console.log('----- get_meeting_detail -----')
	var room_name = req.body.room_name,
		meeting_date = req.body.meeting_date,
		meeting_time = req.body.meeting_time
	if(!room_name){
		return res.json({'Msg':'meeting_room can not be null'})
	}
	if(!meeting_date){
		return res.json({'Msg':'meeting_date can not be null'})
	}
	if(!meeting_time){
		return res.json({'Msg':'meeting_time can not be null'})
	}
	logic.get_meeting_detail(room_name,meeting_date,meeting_time,function(err,result){
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