var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger
const logic = require('../../logic/logic')

router.get('/meeting',function(req,res){
	logic.apply_record(function(result){
		res.render('meeting',{result:result})
	})
})
// router.post('/add_meeting_room',function(req,res){
// 	console.log('----- add_meeting_room -----')

// })
router.get('/reserve',function(req,res){
	res.render('reserve/reserve')
})
module.exports = router