const seneca = require('seneca')();
import config from './config/config';
import confirmUserEmail from './plugins/confirmUserEmail';
import createClient from './config/mail-client';
import mongoose from 'mongoose';

const appConfig = config.app;
const dbConfig = config.database;

//db
mongoose.connect(dbConfig.uri);

//plugins
const mailClient = createClient();
seneca.use(confirmUserEmail,{mailClient});

seneca.listen({
	host:appConfig.host,
	port:appConfig.port
});

mongoose.connection.on('error', () => {
	throw new Error(`Email service ${process.id} is unable 
	to connect to database: ${dbConfig.uri}`); //reconnect here
})