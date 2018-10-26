import Email from '../app/models/email.model';
import {connectToDb,disconnect as disconnectDb} from '../config/mongo';
import {expect} from 'chai';

describe('MongoDb connection',function(){
	let connectionAfter;
	this.timeout(10000);
	beforeEach((done)=>{
		connectToDb();
		connectionAfter = disconnectDb(done);	
	})

	after((done)=>{
		disconnectDb(done)
		process.exit(0);
	})

	it('should try to reconnect after disconnection',(done)=>{
		const stateAfter = connectionAfter.readyState;
		expect(stateAfter).to.equal(2);
		done();
	})
	it('should be available after disconnection',(done)=>{
	setTimeout(()=>{
				Email.find((err,result)=>{
					console.log(result);
			expect(result).to.exist;
			done();
		});		
			},8000);	

	})
})