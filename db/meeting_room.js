/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   会议室
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema

var meeting_roomSchema = new Schema({          
    room_name : { type: String },                    //会议室name(唯一)
    created_at : {
    	type:Date,
    	default:Date.now()
    },
    in_used : {
    	type : Number,   //是否启用(0否，1是)
    	default : 1
    }
})

module.exports = mongoose.model('meeting_room',meeting_roomSchema);