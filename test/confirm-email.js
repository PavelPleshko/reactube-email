import {expect} from 'chai';
import should from 'should';

const Seneca = require('seneca')();
import confirmEmailPlugin from '../plugins/confirmUserEmail';
import nodemailerMock from 'nodemailer-mock';
import mockery from 'mockery';



describe('Nodemailer',()=>{
	let seneca,mailClient;

	before((done)=>{
		
		mockery.enable({
			warnOnUnregistered: false
		});
		mockery.registerMock('nodemailer', nodemailerMock);
		const createMailTransport = require('../config/mail-client').default;
		mailClient = createMailTransport();
		
		done();
	});

	 afterEach(()=>{
    	nodemailerMock.mock.reset();
  	});

	  after(()=>{
	    mockery.deregisterAll();
	    mockery.disable();
 	 });

	it('sends email to specified user without error',(done)=>{
		seneca = testSeneca(done);
		seneca.use(confirmEmailPlugin,{mailClient});
		seneca.act({area:'email',action:'send',type:'confirm_user',
			to:'ppleshko@list.ru',name:'Pablo'},function(err,result){
			const emails = nodemailerMock.mock.sentMail();
			console.log(result);
			expect(err).to.equal(null);
			expect(emails.length).to.equal(1);
			expect(emails[0].to).to.equal('ppleshko@list.ru');
			done();
		});

	})


})


function testSeneca(done){
	return Seneca.test(done,'print');
}