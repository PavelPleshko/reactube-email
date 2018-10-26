import mongoose from 'mongoose';
import config from './config';


const dbConfig = config.database;
const DB = mongoose.connection;
const DB_URI = dbConfig.uri;
const DEFAULT_CONNECT_OPTS = {
				auto_reconnect:true
}

function getConnectionOptions(customOpts={}){
	return {...DEFAULT_CONNECT_OPTS,...customOpts};
}

const connectToDb = async (opts) => {
	try{
		let uri = DB_URI;
		let options = getConnectionOptions(opts);
		await mongoose.connect(uri,options);
		return DB;
	}catch(err){

	}
	
}

const disconnect =  (cb) =>{
	try{
		DB.close(cb);
		return DB;
	}catch(err){
		//console.log(err);
	}
}

DB.on('connecting', function() {
    console.log('Try to connect to mongo');
});

DB.on('connected', function() {
    console.log('Connected');
});

DB.on('disconnected', ()=>{
        console.log("Mongoose default connection is disconnected");
        console.log(`dbURI is: ${DB_URI}`);
        let opts ={auto_reconnect:true};
        connectToDb(opts);
});

DB.on('error',(err)=>{
	console.error(`Error in MongoDb connection: ${err}`);
    mongoose.disconnect();
})

process.on('SIGINT', ()=>{
        DB.close(()=>{
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });

export {
	connectToDb,disconnect
};