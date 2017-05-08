var log4js = require('log4js');

var log4js_config = require("../log4js.json");
log4js.configure(log4js_config);

var dateFileLog = log4js.getLogger('log_info');
var consoleLog = log4js.getLogger('console');

exports.logger = consoleLog;
//exports.logger = dateFileLog

/*exports.use = function(app) {
    app.use(log4js.connectLogger(consoleLog, {level:'auto', format:':method :url'}));
}
*/
/*我们把logger单独定义出来，并且做为API暴露出来，此处是开发调试，没有使用文件输出。 
这样在其他模块中使用logger输出日志只需如下操作：

var logger = require('../../log').logger;
logger.debug("collectTime=%s",collectTime);
样我们就已经玩转log4js了，如果部署生产需要文件输出只要修改log.js中dateFileLog级别，
然后设置exports.logger=dateFileLog即可。
*/
// LogFile.trace('This is a Log4js-Test');
// LogFile.debug('We Write Logs with log4js');
// LogFile.info('You can find logs-files in the log-dir');
// LogFile.warn('log-dir is a configuration-item in the log4js.json');
// LogFile.error('In This Test log-dir is : \'./logs/log_test/\'');
// 
/*// {  
    "appenders": [
        {  
            "type": "console"  
        },
        {  
            "category": "log_info", 
            "type": "dateFile",  
            "filename": "./log/log_info",  
            "pattern": ".yyyy_MM_dd.log",  
            "alwaysIncludePattern": true 
        }, 
        {  
            "category": "log_error",
            "type": "dateFile",
            "filename": "./log/log_error",
            "pattern":".yyyy_MM_dd.log",
            "alwaysIncludePattern": true 
        }
    ],  
    "levels":
    {
        "log_info":"ALL",
        "log_error":"ALL"
    },
    "replaceConsole": true
}  */