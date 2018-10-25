import {expect} from 'chai';
const Seneca = require('seneca')();
import confirmEmailPlugin from '../plugins/confirmUserEmail';
import Email from '../app/models/email.model';
import nodemailerMock from 'nodemailer-mock';
import mockery from 'mockery';
import sinon from 'sinon';
import {connectToDb,disconnect as disconnectDb} from '../config/mongo';

describe('confirmUserEmail',function(){
	this.timeout(10000);
	let seneca,mailClient,confirmEmailPluginMock;

	before((done)=>{
			
		mockery.enable({
			warnOnUnregistered: false
		});
		mockery.registerMock('nodemailer', nodemailerMock);
		connectToDb();
		confirmEmailPluginMock = require('../plugins/confirmUserEmail').default;
		const createMailTransport = require('../config/mail-client').default;
		mailClient = createMailTransport();	
		done();
	});

	 afterEach((done)=>{
    	nodemailerMock.mock.reset();
    	Email.collection.drop();
    	done();
    	
  	});

	 after((done)=>{
	    mockery.deregisterAll();
	    mockery.disable();
	    disconnectDb(done);
 	 });

	it('should call save an email entry without error',(done)=>{
		seneca = testSeneca(done);
		seneca.use(confirmEmailPluginMock,{mailClient});
		seneca.act({area:'email',action:'send',type:'confirm_user',
			to:'ppleshko@list.ru',name:'Pablo'},async function(err){
			expect(err).to.equal(null);		
			const found = await Email.findOne({to:'ppleshko@list.ru'});
			expect(found).to.be.an('object');
			expect(found).to.have.property('_id');
			done();
		});

	});

		it('it should send an email to specified user without error',(done)=>{
		seneca = testSeneca(done);
		seneca.use(confirmEmailPlugin,{mailClient});
		seneca.act({area:'email',action:'send',type:'confirm_user',
			to:'ppleshko@list.ru',name:'Pablo'},function(err,result){
			const emails = nodemailerMock.mock.sentMail();
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