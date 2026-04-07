const moment =require("moment")
const winston =require("winston")
const winstonRotate =require("winston-daily-rotate-file")

 async function getLogger(){
    try{
        return winston.createLogger({
            transports:[
                new winston.transports.DailyRotateFile({
                    filename:"CRON_LOG_%DATE%.log",
                    frequency:"24h",
                    datePattern:"YYYY-MM-DD",
                    maxSize:"1g",
                    maxFiles:"365", 
                    dirname:"logs/cronlogs"
                })
            ]
        });
    }catch(error){
        console.log("error in getLogger() : ",error.message()) 
    }
}

async function createLog(obj){ 
    logger=await getLogger();
    let logmessage= {}; 
    logmessage.time     =   moment().format('DD-MM-YYYY h:mm:ss a');
    logmessage.cronName  =   obj.name; 
    logmessage.startTime  =   obj.startTime; 
    logmessage.endTime   =   obj.endTime;
    logmessage.updateData =   obj.data;
    logger.info(logmessage);
}
module.exports={
    getLogger,
    createLog
}