import {expect} from 'chai';
const Seneca = require('seneca')();
import rewire from 'rewire';
import confirmEmailPlugin from '../plugins/confirmUserEmail';
import Email from '../app/models/email.model';
import nodemailerMock from 'nodemailer-mock';
import mockery from 'mockery';
import sinon from 'sinon';
import {connectToDb,disconnect as disconnectDb} from '../config/mongo';
//funcs
const confirmEmailModule = rewire('../plugins/confirmUserEmail');

const CONFIRM_EMAIL_CMD = {area:'email',action:'send',
						   type:'confirm_user',
						   to:'ppleshko@list.ru',name:'Pablo'};
const TEST_MIN_TIMEOUT = 10000;

describe('confirmUserEmail',function(){
	this.timeout(TEST_MIN_TIMEOUT);
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
	    disconnectDb();
	    done();
 	 });

	it('should call save an email entry without error',(done)=>{
		seneca = testSeneca(done);
		seneca.use(confirmEmailPluginMock,{mailClient});
		seneca.act(CONFIRM_EMAIL_CMD,async function(err){
			expect(err).to.equal(null);		
			const found = await Email.findOne({to:CONFIRM_EMAIL_CMD.to});
			expect(found).to.be.an('object');
			expect(found).to.have.property('_id');
			done();
		});

	});

		it('it should send an email to specified user without error',(done)=>{
		seneca = testSeneca(done);
		seneca.use(confirmEmailPlugin,{mailClient});
		seneca.act(CONFIRM_EMAIL_CMD,function(err,result){
			const emails = nodemailerMock.mock.sentMail();
			expect(err).to.equal(null);
			expect(emails.length).to.equal(1);
			expect(emails[0].to).to.equal(CONFIRM_EMAIL_CMD.to);
			done();
		});

	})


})


describe('createMsg',function(){
	const createMsg = confirmEmailModule.__get__('createMsg');
	const testName = 'George';
	const testLink='coollink.com';

	it('should return a string',(done)=>{
		const result = createMsg(testName,testLink);
		expect(result).to.be.a('string');
		done();
	})
	it('should include test name and test link in resulted string',(done)=>{
		const result = createMsg(testName,testLink);
		expect(result).to.include(testName);
		expect(result).to.include(testLink);
		done();
	})
})

describe('createOptions',function(){
	const createOptions = confirmEmailModule.__get__('createOptions');
	const testName = 'George';
	const testLink='coollink.com';
	const testEmailTo='noname@gmail.com';
	const testEmailFrom = 'nonamefrom@gmail.com';

	const opts={
		name:testName,
		link:testLink,
		to:testEmailTo,
		from:testEmailFrom
	}
	it('should return an object',(done)=>{
		const result = createOptions(opts);
		expect(result).to.be.an('object');
		done();
	})	

	it('returned object should have correct types of its values',(done)=>{
		const result = createOptions(opts);
		expect(result.to).to.be.a('string');
		expect(result.subject).to.be.a('string');
		expect(result.text).to.be.a('string');
		expect(result.html).to.be.a('string');
		done();
	})
})

function testSeneca(done){
	return Seneca.test(done,'print');
}