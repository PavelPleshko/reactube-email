import config from '../config/config';
import confirmEmailTemplate from '../templates/confirm';

const plugin = function({mailClient}){
	const seneca = this;
	const pluginName= 'confirmUserEmail';

	seneca.add({area:'email',action:'send',type:'confirm_user'},function(args,done){
		const opts = createOptions({...args,from:config.email.clientEmail});
		mailClient.sendMail(opts,function(res,err){
			console.log(res,err);
			done(null,{message:`Email has been sent to ${args.to}`});
		})
		
	})


	return pluginName;
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