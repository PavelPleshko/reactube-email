const seneca = require('seneca')();
const confirmUserEmail = require('./plugins/confirmUserEmail');

seneca.use(confirmUserEmail);
seneca.act({area:'email',action:'send',type:'confirm_user'});
