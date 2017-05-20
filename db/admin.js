/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   后台登录账号
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema

var adminSchema = new Schema({          
    username : { type: String },     
    password : { type : String},
    in_used : {
    	type : Number,   //是否启用(0否，1是)
    	default : 1
    },
    created_at:{
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('admin',adminSchema);