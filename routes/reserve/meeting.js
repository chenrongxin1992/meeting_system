var express = require('express')
var router = express.Router()
var logger = require('../../log/logConfig').logger

router.get('/meeting',function(req,res){
	res.render('meeting')
})
// router.post('/add_meeting_room',function(req,res){
// 	console.log('----- add_meeting_room -----')

// })
module.exports = router