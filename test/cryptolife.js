var CryptoLife = artifacts.require("./CryptoLife.sol");

var BN = web3.utils.BN;

contract ("CryptoLife", function(accounts){

	let owner;
	let app;
	let partner1;
	let partner2;
	let partner3;	
	let ownerBalance;
	let ownerBalanceDelta;


	it("Sender should be an owner", function(){

		return CryptoLife.deployed().then(function(instance){

			app = instance;

			return instance.getMyData({from: accounts[0]});

		}).then( async function(data)	{

			owner = data;

			assert.equal(BN(data.id).toNumber(), 1);
			ownerBalance = await web3.eth.getBalance(accounts[0]);

		});

	});

	it ("The owner should have a level 1 of each marketing plan", function(){

				assert.equal(owner.level.length, 1);
				assert.equal(owner.level1.length, 1);
				assert.equal(owner.level2.length, 1);

	});

	let regSumm = web3.utils.toWei('0.025');

	let result;

	it("New partner registered with ID 2 for "+web3.utils.fromWei(regSumm), function(){


		return app.registerNewPartner(1,0,0 ,{from: accounts[1], value:regSumm})
		.then(async function(res){

			result = res;

			partner1 = await app.getMyData({from:accounts[1]});
			let temp = await web3.eth.getBalance(accounts[0]);
			ownerBalanceDelta = temp  - ownerBalance;
			ownerBalance = temp;

			assert.equal(BN(partner1.id).toNumber(), 2);

		});

	});

	it("Partner with ID 2 has the First marketing plan active ", function(){

			assert.equal(partner1.level.length, 1);
	});

	it ("The direct bonus payed to the partner with ID 1 event emited", function(){

		assert.equal(result.logs[1].args.partnerAddress, accounts[0]);
		assert.equal(result.logs[1].args.mp, 0);
		assert.equal(result.logs[1].args.bonusType, 1);
	});


	it ("The direct bonus summ in the event is 75% from "+web3.utils.fromWei(regSumm.toString())+" and equal "+web3.utils.fromWei((regSumm*0.75).toString()), function(){

		assert.equal(result.logs[1].args.amount, regSumm*0.75);

	});

	it ("The network bonuses 20% in total payed to the partner with ID 1  event emited", function(){

		assert.equal(result.logs[2].args.partnerAddress, accounts[0]);
	});	


	it ("The network bonuses summ in the event is 20% from "+web3.utils.fromWei(regSumm.toString())+" and equal "+web3.utils.fromWei((regSumm*0.2).toString()), function(){

		assert.equal(result.logs[2].args.amount, regSumm*0.2);

	});

	it ("The balance of the partner with ID 1 growed up on "+web3.utils.fromWei((regSumm*0.95).toString()), function(){

		assert.equal(ownerBalanceDelta, regSumm*0.95);
	});


	it ("The partner with ID 1 has 1 referal ", function(){

		app.getMyData({from:accounts[0]}).then(function(data){

			owner = data;

			assert.equal(owner.referals.length, 1);
		});

	});

	it ("The partner with ID 1 has 1 partner in the network ", function(){

		app.getMyData({from:accounts[0]}).then(function(data){

			owner = data;

			assert.equal(owner.network, 1);
		});

	});

	let regSumm2 = web3.utils.toWei('0.125');


	it("New partner registered with ID 3 by "+web3.utils.fromWei(regSumm2.toString()), function(){


		return app.registerNewPartner(2,1,0 ,{from: accounts[2], value:regSumm2})
		.then(async function(res){

			result = res;

			partner2 = await app.getMyData({from:accounts[2]});

			assert.equal(BN(partner2.id).toNumber(), 3);

		});

	});

	it("The partner with ID 3 has the First and Second marketing plans active ", function(){

			assert.equal(partner2.level.length, 1);
			assert.equal(partner2.level1.length, 1);
			assert.equal(partner2.level2.length, 0);
	});

	it ("The partner with ID 1 has 2 partners in the network now", function(){

		app.getMyData({from:accounts[0]}).then(function(data){

			owner = data;

			assert.equal(owner.network, 2);

		});

	});

	it ("The direct bonus for the First marketing plan payed to the partner with ID 2", function(){

		assert.equal(result.logs[1].args.partnerAddress, accounts[1]);
		assert.equal(result.logs[1].args.mp, 0);
		assert.equal(result.logs[1].args.bonusType, 1);
	});


	it ("The direct bonus summ is 75% from "+web3.utils.fromWei(regSumm.toString())+" and equal "+web3.utils.fromWei((regSumm*0.75).toString()), function(){

		assert.equal(result.logs[1].args.amount, regSumm*0.75);

	});

	it ("The network bonuses 20% in total payed to the partner with ID 1", function(){

		assert.equal(result.logs[2].args.partnerAddress, accounts[0]);
	});	


	it ("The network bonuses summ is 20% from "+web3.utils.fromWei(regSumm.toString())+" and equal "+web3.utils.fromWei((regSumm*0.2).toString()), function(){

		assert.equal(result.logs[2].args.amount, regSumm*0.2);

	});	

	it ("The partner with ID 2 missed direct bonus for the Second marketing plan activation", function(){

		assert.equal(result.logs[4].args.partnerAddress, accounts[1]);
		assert.equal(result.logs[4].args.mp, 1);
		assert.equal(result.logs[4].args.bonusType, 1);
	});	

	it ("The direct bonus for the Second marketing plan payed to the partner with ID 1", function(){

		assert.equal(result.logs[5].args.partnerAddress, accounts[0]);
		assert.equal(result.logs[5].args.mp, 1);
		assert.equal(result.logs[5].args.bonusType, 1);
	});


	it ("The direct bonus summ is 75% from "+web3.utils.fromWei((regSumm2-regSumm).toString())+" and equal "+web3.utils.fromWei(((regSumm2-regSumm)*0.75).toString()), function(){

		assert.equal(result.logs[5].args.amount, (regSumm2-regSumm)*0.75);

	});

	it ("The network bonuses 20% in total payd to the partner with ID 1", function(){

		assert.equal(result.logs[6].args.partnerAddress, accounts[0]);
	});	


	it ("The network bonuses summ is 20% from "+web3.utils.fromWei((regSumm2-regSumm).toString())+" and equal "+web3.utils.fromWei(((regSumm2-regSumm)*0.2).toString()), function(){

		assert.equal(result.logs[6].args.amount, (regSumm2-regSumm)*0.2);

	});

	let regSumm3 = web3.utils.toWei('0.625');

	it("New partner registered with ID 4 by "+web3.utils.fromWei(regSumm3.toString()), function(){


		return app.registerNewPartner(3, 2, 0, {from: accounts[3], value:regSumm3})
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[3]});

			assert.equal(BN(partner3.id).toNumber(), 4);

		});

	});

	it ("The partner with ID 1 has 3 partners in the network now", function(){

		app.getMyData({from:accounts[0]}).then(function(data){

			owner = data;

			assert.equal(owner.network, 3);

		});

	});


	it("The partner with ID 4 level up the Second marketing plan to the level 2 "+web3.utils.fromWei((regSumm2*2).toString()), function(){


		return app.partnerLevelUp(1, 1, 0, {from: accounts[3], value:regSumm2*2}) 
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[3]});

			assert.equal(partner3.level1.length, 2);
			assert.equal(partner3.level.length, 2);

		});

	});


	it("The partner with ID 4 level up the Third marketing plan to the level 2 "+web3.utils.fromWei((regSumm3*2).toString()), function(){


		return app.partnerLevelUp(2, 1, 0, {from: accounts[3], value:regSumm3*2}) 
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[3]});

			assert.equal(partner3.level2.length, 2);

		});

	});	

	it("New partner registered with ID 5 by "+web3.utils.fromWei(regSumm3.toString()), function(){


		return app.registerNewPartner(4, 2, 0, {from: accounts[5], value:regSumm3})
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[5]});

			assert.equal(BN(partner3.id).toNumber(), 5);

		});

	});

	it("The partner with ID 5 level up the Third marketing plan to the level 6 for 6.2", function(){


		return app.partnerLevelUp(2, 5, 0, {from: accounts[5], value:regSumm3*2**6}) 
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[5]});

			assert.equal(partner3.level2.length, 6);

		});

	});		


	it("Special registration up to level 3 completed", function(){


		return app.marketingReg(accounts[6], 3) 
		.then(async function(res){

			result = res;

			partner3 = await app.getMyData({from:accounts[6]});

			assert.equal(partner3.level2.length, 3);

		});

	});
});