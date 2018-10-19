const plugin = function(opts){
	const seneca = this;
	const pluginName= 'confirmUserEmail';
	seneca.add({area:'email',action:'send',type:'confirm_user'},function(args,done){
		console.log(args,'sending email whooohoo');
		done(null,{from:'a',to:'b'});
	})


	return pluginName;
}

module.exports = plugin;