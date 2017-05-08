var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger

router.get('/add_meeting_room',function(req,res){
	res.render('manage/add_meeting_room')
})
router.post('/add_meeting_room',function(req,res){
	console.log('----- add_meeting_room -----')

	var room_name = req.body.room_name
	if(!room_name){
		return res.json({'errMsg':'会议室编号或名称不能为空！'})
	}

})
module.exports = router