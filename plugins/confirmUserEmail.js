import config from '../config/config';
import confirmEmailTemplate from '../templates/confirm';
import EmailModel from '../app/models/email.model';

const plugin = function({mailClient}){
	const seneca = this;
	const pluginName= 'confirmUserEmail';

	seneca.add({area:'email',action:'send',type:'confirm_user'},async function(args,done){
		const opts = createOptions({...args,from:config.email.clientEmail});
		try{
			const result = await sendEmail(mailClient,opts);
			done(null,{message:`Email has been sent to ${args.to}`});
		}catch(err){
			done(err);
		}		
				// try{
				// 	const email = new Email(args);
				// 	await email.save();		
	})
	return pluginName;
}

export function sendEmail(client,opts){
	return new Promise((resolve,reject)=>{
		client.sendMail(opts,(err,res)=>{
			if(err){
				 reject(err);
			}else{
				 resolve(res);
			}			
		})
	})
}

function createOptions({to,name,from,link}){
	const mailOpts = {
	  to,
	  subject:'Email confirmation',
	  from,
	  text:createMsg(name,link),
	  html:confirmEmailTemplate({name,link})
	}
	return mailOpts;
}

function createMsg(name,link){
	return `Hello ${name}, I hope you are having a good day.
			You have registered on a website https://reactube.com
			Please paste the following link in the address bar to confirm email.
			${link}
			`
}

export default plugin;