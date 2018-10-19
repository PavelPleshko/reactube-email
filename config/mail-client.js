import nodemailer from 'nodemailer';
import config from './config';

const mailConfig = config.email;


const smtpTransport = ()=>{ 
	return nodemailer.createTransport({
		    service: mailConfig.serviceName,
		    host: mailConfig.serviceHost,
		    port:mailConfig.servicePort,
		    auth: {
		        user: mailConfig.clientEmail,
		        pass: mailConfig.clientPassword
		    }
		})
}


export default smtpTransport;