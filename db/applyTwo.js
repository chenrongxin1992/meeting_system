/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   申请表
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema,
    moment = require('moment')

var applyTwoSchema = new Schema({          
    room_name : {type : String },                                      //会议室name
    meeting_name :{type : String },                                    //会议名称
    meeting_num:{type : Number},                                       //人数
    meeting_content :{type:String},                                    //会议内容
    apply_time : {type : String, default : moment().format('YYYY-MM-DD HH:mm:ss') },     //申请时间 
    meeting_date : {type : String },                                   //会议日期 5月10日
    meeting_time :{type : String },                                    //会议时间 前期简单，只使用上午、中午、下午、晚上，对应(0、1、2、3)
    apply_name : {type :String},                                       //申请人
    apply_phone : {type : String},                                     //联系方式
    is_approved : {type : String,default : 0},                         //是否批准(0：未批，1：批准，2：不批)
    exact_meeting_time : {type : String},
    email : {type : String},
    apply_timeStamp : {type : String,default:moment().format('X')},
    is_allowed : {type : String,default:0},//设置不批准的时候置为1
    first_hour : {type : String},
    second_hour : {type : String},
    first_minute : {type : String},
    second_minute : {type :String}
})

module.exports = mongoose.model('applyTwo',applyTwoSchema);