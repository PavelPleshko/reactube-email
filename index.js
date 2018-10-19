const seneca = require('seneca')();
import config from './config/config';
import confirmUserEmail from './plugins/confirmUserEmail';
import createClient from './config/mail-client';

const appConfig = config.app;

//plugins
const mailClient = createClient();
seneca.use(confirmUserEmail,{mailClient});




seneca.listen({
	host:appConfig.host,
	port:appConfig.port
});