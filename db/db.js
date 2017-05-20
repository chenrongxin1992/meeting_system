/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-05-15
 *  @Description:   数据库配置
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const DB_URL = 'mongodb://localhost:27017/meeting_system'
mongoose.connect(DB_URL)

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});   

module.exports = mongoose