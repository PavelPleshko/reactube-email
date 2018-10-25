import mongoose from 'mongoose';
import config from './config';


const dbConfig = config.database;

const connectToDb = async () => {
	let uri = dbConfig.uri;
	try{
			const db = await mongoose.connect(uri);
			return mongoose.connection;
	}catch(err){
		console.log(err);
	}
}

const disconnect = (cb) =>{
	try{
	mongoose.connection.close(cb);
}catch(err){
	console.log(err);
}
}



export {
	connectToDb,disconnect
};