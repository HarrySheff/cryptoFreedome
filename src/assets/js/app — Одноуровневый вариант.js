App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  crypto: "ETH",
  chainName: 'Ehtereum Mainnet',
  balance: 0,
  exchange: {},
  currentRate: 0,
  currentCurrency: 'USD',
  currencyIconClass:{'USD':'bx bx-dollar','EUR':'bx bx-euro', 'ILS':'bx bx-shekel','GBP':'bx bx-pound','JPY':'bx bx-yen','WAN':'bx bx-won','RUB':'bx bx-ruble',},
  lastSeenBlock: 0,
  directIncome: 0,
  networkIncome: 0,
  lostProfit: 0,
  directIncomePlus: 0,
  networkIncomePlus: 0,
  lostProfitPlus: 0,
  referals: [],
  referalsPlus: 0,
  referalsLenght: 0,
  network: 0,
  networkPlus: 0,
  partnerId: 0,
  nextLevelPrice: 0,
  partnerRegPrice: 0,
  newRegPrice: 0,
  nextCup: 0,
  level: [],
  notifications: [],
  partnersCount: 0,
  maxRegPrice: 0,
  nextRegPrice: 0,
	topLeader: '0x0',
	topBalance: 0,
	topBonusSumm: 0,
	topResult: 0,
	topDelta: 0,
	topMinimumLevel: 0,	
	sponsorId: 2,

	showError: function(show, title, text){

		if (show) {
			$("#error").addClass('d-flex');
			$("#error").show();
			$("#error h1")[0].innerHTML = title;
			$("#error p")[0].innerHTML = text;
			$(".nav-container").hide();
			$(".page-wrapper").hide();
			$("#userIdContainer").hide();

		} else {
			$("#error").removeClass('d-flex');
			$("#error").hide();
			$(".nav-container").show();
			$(".page-wrapper").show();
			$("#userIdContainer").show();
		}

	},


  init:  async function() {
		var requestURL = 'https://min-api.cryptocompare.com/data/price?fsym='+App.crypto+'&tsyms=USD,ILS,JPY,EUR,WAN,RUB,GBP ';
		var request = new XMLHttpRequest();
		request.open('GET', requestURL);
		request.responseType = 'json';
		request.send();
		request.onload = function() {
			App.exchange = request.response;
			console.log('--- App initiated ---');
			return App.initWeb3();
  	}
 		
  },


  initWeb3: async function() {
    
    // Modern dapp browsers...
		if (window.ethereum) {
		  App.web3Provider = window.ethereum;
			ethereum.on('accountsChanged', (accounts) => {
				// Handle the new accounts, or lack thereof.
				// "accounts" will always be an array, but it can be empty.
				if (accounts.length === 0) {
					// MetaMask is locked or the user has not connected any accounts
					console.log('Please connect to MetaMask.');

					App.showError(true, 'MetaMask is Dissconnected', 'Plese connect to MetaMask and choose '+App.chainName+'.');

				} else if (accounts[0] !==  App.account) {
				  App.account = accounts[0];
				}
				App.notifications = [];
					  		 
				window.location.reload();
			});

			ethereum.on('chainChanged', (chainId) => {
			 	// Handle the new chain.
		  	// Correctly handling chain changes can be complicated.
			  // We recommend reloading the page unless you have good reason not to.

			  window.location.reload();
			});

		  try {
		  	console.log('--- Try request an account ---');
		  	App.showError(true, 'Login to MetaMask', "Please connect and allow Criptolife access to it. ")

		    // Request account access
		    await window.ethereum.enable();
		  } catch (error) {
		    // User denied account access...
		    console.warn("User denied account access");

		    App.showError(true, 'Access denied...', 'Plese allow Criptolife access to the wallet.');
		    return App.render();
		  }
		}
		// Legacy dapp browsers...
		else if (window.web3) {
		  App.web3Provider = window.web3.currentProvider;
		}
		// If no injected web3 instance is detected, fall back to Ganache
		else {
		  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		  App.showError(true, 'No wallet detected', "Please install MetaMask and connect to it. ")
		}
		web3 = new Web3(App.web3Provider);

		console.log('--- Web3 initiated ---');

    return App.initContract();
  },

  initContract: function() {


	    $.getJSON("CryptoLife.json", function (data) {

	      // Instance a new truffle contract from the artifact
	      App.contracts.CryptoLife = TruffleContract(data);
	      
	      //Connect provider to interact with contract
	      App.contracts.CryptoLife.setProvider(App.web3Provider);

	      App.setDefaults();

	      console.log('--- Contract initiated ---');
	      return App.initAccount();

	    });

   
  },

  initAccount: function(){

		web3.eth.getCoinbase(function(err,account) {

      if (err == null) {
        App.account = account;
        web3.eth.getBalance(App.account, web3.eth.defaultBlock, function(err, balance){
        	if (err != null) {
        		console.log(err);
        	} else {
        		App.balance = balance;
        	}
        });

        //Reading cookies function
			  function getCookie(name) {
			  	// Set cookies sthring
				  var value = "; " + document.cookie;

				  // Split cookies string on parts with and without varible name
				  var parts = value.split("; " + name + "=");

				  // Check parts number
				  //Second part should starts from value of varible 
				  // If exist second part, return a value from start to splitter ";"
				  if (parts.length == 2) return parts.pop().split(";").shift();
				}

				//Get network number and convert it to number from string
				let temp = parseInt(getCookie( App.account+'_network'),10);
				if (temp != null && temp >0) {
					App.network = temp;
					console.log( "network: " + App.network);
				}

				//Get referals lenght and convert it to number from string
				temp = parseInt(getCookie( App.account+'_referals'),10);
				if (temp != null && temp >0) {
					App.referalsLenght = temp;
					console.log( "referals: " + App.referalsLenght);
				}

				//Get last seen block
				temp = parseInt(getCookie( App.account+'_lastSeenBlock'),10);
				if (temp != null && temp >0) {
					App.lastSeenBlock = temp;
					console.log('lastSeenBlock: ' + App.lastSeenBlock);
				}				

				//Get currency
				temp = getCookie( App.account+'_currentCurrency');
				if (temp != null ) {
					App.currentCurrency = temp;
					console.log('currentCurrency: ' + App.currentCurrency);
				}	

				console.log('--- Account initiated ---');

        return  App.deployContract(); 
      } else {

      	console.log("Init Account Error: "+ err);
      	return App.deployContract();
      }

    });  	

  },


  deployContract: async function () {

  	

    // Get deployed contract

    App.contracts.CryptoLife.deployed().then(function(instance){
   		App.cryptoLife = instance;
   		console.log('--- Contract deployed ---');
   		return App.loadContractData();
    })
    .catch(function(error){

  		console.warn(error);
  		App.showError(true, 'Contract not found...', 'Plese check if MetaMask connected to '+App.chainName+'.');

  	});

  		
  
	},

	loadContractData: async function(init) {

		App.newRegPrice = await App.cryptoLife.getRegistrationPrice().catch(function(error){

		  console.warn(error);

		});


		App.newRegPrice /=10**18;

		await App.loadRegPriceCup();

		await App.loadTopLeaderData();

		await App.loadPartnerData();

 		App.listenForEvents();

 		console.log('--- Contract Data loaded ---');

		return App.render();

	}, 

	loadRegPriceCup: async function() {  	

		let priceData = await App.cryptoLife.getRegistrationCup().catch(function(error){

			    	console.warn(error);
		});

		if (priceData != null) {

			App.nextCup = priceData[0];
			App.partnersCount = priceData[1];
			App.nextRegPrice = priceData[2];
			App.maxRegPrice = priceData[3];			
		}
	},

	loadTopLeaderData: async function() {

		let top = await App.cryptoLife.getTopLeaderData({from:App.account}).catch(function(error){

			console.warn(error);

		});

		if (top !=null){


			// Set an address of the Top Leader
			App.topLeader = top[0];

			// Set contract balance
			App.topBalance = top[1];

			// Set summ of the Top Leader bonus
			App.topBonusSumm = top[2];

			// Set result of the Top Leader
      App.topResult = top[3];

			// Set delta between results of the Top Leader and the Partner
			App.topDelta = top[4];

			// Set minimum required level 
			App.topMinimumLevel = top[5];	
		}
		    		
  },

  loadPartnerData: async function (toRender) {


		let isRegistered = await	App.cryptoLife.isRegistered({from:App.account}).catch(function(error) {

		      console.warn(error);

		      return App.render();
		      
		    });

		if (isRegistered){
					
			let partner = await	App.cryptoLife.getMyData({from:App.account}).catch(function(error) {

			  console.warn(error);

			  return App.render();
			      
			});

			if (partner != null && partner[0]>0){

				//Cookie expiration date
				let date = new Date;

				//Add one year
				date.setDate(date.getDate() + 360); 

				//Convert to UTC format
				date = date.toUTCString();

				    		
				App.partnerId = partner[0];
				App.level = partner[1];
				App.partnerRegPrice = partner[2];
				App.date = partner[3];
				App.referals = partner[4];
				App.referalsPlus = App.referals.length - App.referalsLenght;
				App.referalsLenght = App.referals.length;
				App.networkPlus = partner[5] - App.network;
				App.network = partner[5];
				App.nextLevelPrice = partner[6];
				   			
				document.cookie = App.account +'_network='+App.network+'; path=/; expires=' + date;

				document.cookie = App.account +'_referals='+App.referals.length+'; path=/; expires=' + date;
			} 

		}

		if(toRender) {App.render()}

	},				

  listenForEvents: async function(){

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 

			let currentBlockNumber = 0;
			await web3.eth.getBlockNumber(function(err, b){
				currentBlockNumber = b;
				console.log(currentBlockNumber);
			});

			// Catch bonus paid out
	    App.cryptoLife.bonusPaidOut(
	    		{partnerAddress: App.account},
	    		{fromBlock: 0,
	    		toBlock:'latest'
	    	}, function (error, event){

			    if (error == null) {
	
			    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

				    	let mess = {};
				    	let messDate = new Date(block.timestamp*1000).toLocaleString();
							switch (event.args.bonusType.toString()){
								case '1':								
									App.directIncome +=event.args.amount/10**18;
									    	
									if (event.blockNumber > App.lastSeenBlock) {
										  
										App.directIncomePlus += event.args.amount/10**18;
										//App.lastSeenBlock = event.blockNumber;
										document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
										await App.loadPartnerData();
								}

						    	mess.type = 'directBonus';
						    	mess.title = 'Direct bonus ' +event.args.amount/10**18+' '+App.crypto;
						    	mess.info = 'Level '+event.args.level+' slot was taken by the Partner.' ;
						    	
								break;

								case '0':								
									App.networkIncome +=event.args.amount/10**18;
									    	
									if (event.blockNumber > App.lastSeenBlock) {
										  
										App.networkIncomePlus += event.args.amount/10**18;
										//App.lastSeenBlock = event.blockNumber;
										document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
									}

						    	mess.type = 'leaderBonus';
						    	mess.title = 'Top Leader bonus '+event.args.amount/10**18+' '+App.crypto;
						    	mess.info = 'Congratulations! Great job! Keep growing!' ;
						    	await App.loadTopLeaderData();

								break;

								default:
									App.networkIncome +=event.args.amount/10**18;
									if (event.blockNumber > App.lastSeenBlock) {
										App.networkIncomePlus += event.args.amount/10**18;
										//App.lastSeenBlock = event.blockNumber;
										document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
								}	

						    	mess.type = 'networkBonus';
						    	mess.title = 'Network bonus ' +event.args.amount/10**18+' '+App.crypto;
						    	mess.info = ' The Prtner at depth '+event.args.bonusType+' took a Level '+event.args.level+' slot.';
						    	
								break;					    	
							}

							mess.dateTime =  block.timestamp*1000; 
							mess.new = event.blockNumber > App.lastSeenBlock;
							App.notifications.push(mess);
							

							App.render();
							
							
						});
					} else {

						console.log("Event error: "+ error);
					}
	    });
	  	
	  	// Chatch lost profit
	  	App.cryptoLife.missingBounus(
	    	{partnerAddress: App.account},
	    	{fromBlock: 0,
	    	toBlock:'latest'
	    }, function (error, event){

				App.lostProfit +=event.args.amount/10**18;
			
				if (event.blockNumber > App.lastSeenBlock) {
							    	
					App.lostProfitPlus += event.args.amount/10**18;

				}

	    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

		    	let mess = {};
		    	let messDate = new Date(block.timestamp*1000).toLocaleString();

		    	mess.type = 'missed';
		    	mess.title = event.args.amount/10**18+' '+App.crypto+' of profit lost';
		    	mess.dateTime = block.timestamp*1000; 
		    	mess.info = 'Raise the level to receive Level ' +  event.args.level + ' bonuses.';
		    	mess.new = event.blockNumber > App.lastSeenBlock;
		    	App.notifications.push(mess);
		    	if (mess.new) {

						//App.lastSeenBlock = event.blockNumber;
						document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
		    	}

					App.render();
				});

   	  });

	  	// Chatch pool reopen
	  	App.cryptoLife.poolIsReopened(
	    	{partnerAddress: App.account},
	    	{fromBlock: 0,
	    	toBlock:'latest'
	    }, function (error, event){

	    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

		    	let mess = {};
		    	let messDate = new Date(block.timestamp*1000).toLocaleString();

		    	mess.type = 'reopen';
		    	mess.title = 'Reopen of the pool';
		    	mess.dateTime = block.timestamp*1000; 
		    	mess.info = 'Your Level '+event.args.level+' pool was reopened.';
		    	mess.new = event.blockNumber > App.lastSeenBlock;
		    	App.notifications.push(mess);
		    	if (mess.new) {

						//App.lastSeenBlock = event.blockNumber;
						document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
		    	}
					App.render();	    	

				});

   	  });

	  	// Catch new referal registration
	  	App.cryptoLife.registration(
	    	{sponsorAddress: App.account},
	    	{fromBlock: 0,
	    	toBlock:'latest'
	    }, function (error, event){

				App.referalsLenght ++;
			
				if (event.blockNumber > App.lastSeenBlock) {
							    	
					App.referalsPlus ++;

				}	    	
				
	    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

		    	let mess = {};
		    	let messDate = new Date(block.timestamp*1000).toLocaleString();

		    	mess.type = 'referal';
		    	mess.title = 'New referal registered';
		    	mess.dateTime = block.timestamp*1000; 
		    	mess.info = 'You have new referal with ID '+ event.args.partnerID+'.';

					mess.new = event.blockNumber > App.lastSeenBlock;
		    	App.notifications.push(mess);
		    	if (mess.new) {

						//App.lastSeenBlock = event.blockNumber;
						document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
		    	}

					await App.loadRegPriceCup();
					await App.loadTopLeaderData();	
					await App.loadPartnerData(true);
							    	
				});

   	  });


	  	// Chatch user level up
	  	App.cryptoLife.levelUp(
	    	{partnerAddress: App.account},
	    	{fromBlock: 0,
	    	toBlock:'latest'
	    }).watch(function (error, event){

	    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

		    	let mess = {};
		    	
		    	mess.type = 'levelUp';
		    	mess.title = 'You\'ve reached Level '+ event.args.level;
		    	mess.dateTime = block.timestamp*1000; 
		    	mess.info = 'Reopens of pools Level '+ (event.args.level-1) +' & less unlimited now.';
					mess.new = event.blockNumber > App.lastSeenBlock;
					App.notifications.push(mess);
		    	if (mess.new) {
						//App.lastSeenBlock = event.blockNumber;
						document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
		    	}
						
					await App.loadPartnerData(true);

	    	});


   	  });

	  	// Chatch user registration
	  	App.cryptoLife.registration(
	    	{partnerAddress: App.account},
	    	{fromBlock: 0,
	    	toBlock:'latest'
	    }, function (error, event){
	    	
	    	web3.eth.getBlock(event.blockNumber, false, async function (err, block) {

		    	let mess = {};


		    	mess.type = 'registration';
		    	mess.title = 'Registration complete';
		    	mess.dateTime = block.timestamp*1000; 
		    	mess.info = 'Your Criptolife starts right now!';
					mess.new = event.blockNumber > App.lastSeenBlock;
					App.notifications.push(mess);
		    	if (mess.new) {

						//App.lastSeenBlock = event.blockNumber;
						document.cookie = App.account +'_lastSeenBlock='+event.blockNumber+'; path=/; expires=' + date;
		    	}

					await App.loadRegPriceCup();
					await App.loadTopLeaderData();	
					await App.loadPartnerData(true);

	    	});
   	  });

   	 console.log('--- Event listeners initiated ---');   	  

  },

  levelUp: function (levelUp){
 		if (levelUp) {

			App.cryptoLife.partnerLevelUp({from:App.account, value:App.nextLevelPrice}).catch(function(error){
 						console.warn(error);
 				});

 		} else {

 			App.cryptoLife.registerNewPartner(App.sponsorId, {from:App.account, value:App.newRegPrice*10**18}).catch(function(error){
 						console.warn(error);
 				});
 		}
 	},

  changheCurrentCurrency: function (currency){

    	$('#currentExchangeRate')[0].innerHTML= App.exchange[currency];
    	$('#income')[0].innerHTML= (App.exchange[currency]*(App.directIncome + App.networkIncome)).toFixed(2);
    	if (App.directIncomePlus + App.networkIncomePlus>0)
    	{
    		
    		$('#incomePlus')[0].innerHTML= '+' + (App.exchange[currency]*(App.directIncomePlus + App.networkIncomePlus)).toFixed(2);
    		$('#incomePlus').show();

    	}else {

    		$('#incomePlus').hide();
    	}
      $('#current-currency').attr('class', App.currencyIconClass[currency]);
      $('#current-currency-income').attr('class', App.currencyIconClass[currency]);
      App.currentRate = App.exchange[currency];
      App.currentCurrency = currency;

  },

  renderExchangeRates: function (){

  	$("#USD span")[0].innerHTML = App.exchange.USD.toFixed(2);
		$("#EUR span")[0].innerHTML = App.exchange.EUR.toFixed(2);		
		$("#ILS span")[0].innerHTML = App.exchange.ILS.toFixed(2);
		$("#GBP span")[0].innerHTML = App.exchange.GBP.toFixed(2);
		$("#JPY span")[0].innerHTML = App.exchange.JPY.toFixed(2);
		$("#WAN span")[0].innerHTML = App.exchange.WAN.toFixed(2);
		$("#RUB span")[0].innerHTML = App.exchange.RUB.toFixed(2);

		$('#USD').click(toUSD);
    $('#EUR').click(toEUR);    
    $('#ILS').click(toILS);
   	$('#GBP').click(toGBP);
    $('#JPY').click(toJPY);
   	$('#WAN').click(toWAN);
    $('#RUB').click(toRUB);

    function toUSD() {

    	// Change current currency to USD
      App.changheCurrentCurrency('USD');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=USD; path=/; expires=' + date;
    }

    function toEUR() {

    	// Change current currency to EUR
      App.changheCurrentCurrency('EUR');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=EUR; path=/; expires=' + date;
    }

    function toILS() {

    	// Change current currency to ILS
      App.changheCurrentCurrency('ILS');
 
 			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=ILS; path=/; expires=' + date;

   }

    function toGBP() {

    	// Change current currency to GBP
      App.changheCurrentCurrency('GBP');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=GBP; path=/; expires=' + date;
    }

    function toJPY() {
    	
    	// Change current currency to JPY
      App.changheCurrentCurrency('JPY');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=JPY; path=/; expires=' + date;
    }
	
		function toWAN() {
    	
    	// Change current currency to WAN
      App.changheCurrentCurrency('WAN');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=WAN; path=/; expires=' + date;
    }
	
		function toRUB() {
    	
    	// Change current currency to RUB
      App.changheCurrentCurrency('RUB');

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency=RUB; path=/; expires=' + date;
    }

    App.changheCurrentCurrency(App.currentCurrency);

  },


  renderNotifications: function () {

  	let newsCount = 0;
  	let notificationsList = $("#header-notifications-list");
  	notificationsList.empty();
  	App.notifications = App.notifications.sort(function(a,b){

  		return new Date(b.dateTime) - new Date(a.dateTime);

  	});
  	
  	for(let i = 0; i<App.notifications.length; i++){

  		let mess = App.messegeEtalon.clone(true);
  
  		if (App.notifications[i].new) {
	  		switch (App.notifications[i].type){
	  			case 'registration': 
	  				mess.find("#messIcon i").attr("class",'bx bx-check-double');
	  				mess.find("#messIcon").attr("class",'notify bg-primary text-white');

	  			break;
	  			case 'referal': 
	  				mess.find("#messIcon i").attr("class",'bx bx-user-plus');
	  				mess.find("#messIcon").attr("class",'notify bg-primary text-white');

	  			break;
	  			case 'reopen': 
	  				mess.find("#messIcon i").attr("class",'bx bx-rotate-left');

	  			break;
	  			case 'directBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-money');
						mess.find("#messIcon").attr("class",'notify bg-success text-white');

	  			break;
	  			case 'networkBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-coin');
	  				mess.find("#messIcon").attr("class",'notify bg-white text-success');

	  			break;
	  			case 'leaderBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-trophy');
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');

	  			break;
	  			case 'missed': 

	  				mess.find("#messIcon i").attr("class",'bx bx-error');  
	  				mess.find("#messIcon").attr("class",'notify bg-youtube text-white');

	  			break;
	  			case 'levelUp': 
	  				mess.find("#messIcon i").attr("class",'bx bx-sort-up'); 

	  			break;
	   		}



	  			newsCount ++;


	  		mess.find("#messTitle")[0].innerHTML = App.notifications[i].title;

	  		let messDate = new Date(App.notifications[i].dateTime).toLocaleString();

	   		mess.find("#messDateTime")[0].innerHTML = messDate.substr(0, messDate.indexOf(','));

	   		mess.find(".msg-info")[0].innerHTML = App.notifications[i].info;

	  		notificationsList.append(mess);
  		}
  	}
  	$("#newMessBage")[0].innerHTML = newsCount;
  	$("#newMessCount")[0].innerHTML = newsCount;

  	// Set a notification list heigth fit to messages count
  	// Should find more sutable metod to calculate haeigt

  	let listHeight = 0;
  	if (newsCount <5){
  		listHeight = newsCount*App.messageHeight;
  	} else {
  		listHeight = 5*App.messageHeight;
  	}

  	$(".header-notifications-list").height(listHeight);
  	
  	

  },

  setModals: function( type){

  	if (type == 'levelUp'){

  		$(".levelUpButton").each(function(){this.setAttribute('data-target','#levelUpModal'); });
  		$(".modalLevel").each(function(){this.innerHTML = App.level.length+1});
  		$("#modalCurrentLevel")[0].innerHTML = App.level.length;
  		$('#modalLevelUpBtn').off('click');
  		$('#modalLevelUpBtn').on('click', function(){App.levelUp(true);});

  	} else {
  		$(".levelUpButton").each(function(){this.setAttribute('data-target','#registerModal')});
  		$('#modalRegistrationBtn').off('click');
  		$('#modalRegistrationBtn').on('click',function(){App.levelUp(false);});
  	}

  },

  render: function() {

  	$(".crypto").each(function(){this.innerHTML = App.crypto});
  	$('#balance')[0].innerHTML = (App.balance/10**18).toFixed(4);
  	App.renderExchangeRates();


    $("#userAccount")[0].innerHTML = App.account.substr(0,12)+'...'+App.account.substr(App.account.length-6);

  	var nextLevelCard = $("#nextLevelCard").detach();  
	  var pools = $("#pools");

	  pools.empty();
	  var row = $('<div class="row"></div>');

    if (App.partnersCount<App.nextCup) {


	    $("#priceBar").css("width", App.partnersCount/App.nextCup*100+"%");
	    $("#regsToCup")[0].innerHTML =  App.nextCup - App.partnersCount;
    } else {
	    $("#priceBar").css("width","100%");
	    $("#regsToCup")[0].innerHTML =  0;
    }

    $("#nextRegPrice")[0].innerHTML = App.nextRegPrice/10**18;
    $("#regPrice")[0].innerHTML = App.newRegPrice;

    $("#topSumm")[0].innerHTML = App.topBonusSumm/10**18;
    $("#topResult")[0].innerHTML = App.topResult;
    $("#topLeaderBar").css("width", App.topBalance/App.topBonusSumm*100+"%");

    let topMess ='';

  	if ( App.partnerId >0) {
  		$("#userId")[0].innerHTML = App.partnerId;


  		App.renderNotifications();

    	$("#directIncome")[0].innerHTML = App.directIncome.toFixed(4);
    	if (App.directIncomePlus >0){
    		$("#directIncomePlus").show();
    		$("#directIncomePlus")[0].innerHTML ='+' + App.directIncomePlus.toFixed(4);
    	} else {
    		$("#directIncomePlus").hide();
    	}

    	$("#networkIncome")[0].innerHTML = App.networkIncome.toFixed(4);
    	if (App.networkIncomePlus >0){
    		$("#networkIncomePlus").show();
    		$("#networkIncomePlus")[0].innerHTML ='+' + App.networkIncomePlus.toFixed(4);
    	} else {
    		$("#networkIncomePlus").hide();
    	}

    	$("#incomeCrypto")[0].innerHTML = (App.directIncome + App.networkIncome).toFixed(4);
    	if (App.networkIncomePlus + App.directIncomePlus >0){
    		$("#incomeCryptoPlus").show();
    		$("#incomeCryptoPlus")[0].innerHTML ='+';
    		$("#incomeCryptoPlus")[0].innerHTML += (App.networkIncomePlus + App.directIncomePlus).toFixed(4);
    	} else {
    		$("#incomeCryptoPlus").hide();
    	}

    	$("#lostProfit")[0].innerHTML = App.lostProfit.toFixed(4);
    	if (App.lostProfitPlus >0){
    		$("#lostProfitPlus").show();
    		$("#lostProfitPlus")[0].innerHTML ='+' + App.lostProfitPlus.toFixed(4);
    	} else {
    		$("#lostProfitPlus").hide();
    	}

    	$("#levelUpText")[0].innerHTML = 'Level Up';		


    	$("#level")[0].innerHTML = App.level.length;

	    for (i = 0; i<App.level.length; i++){

	    	let levelCard = App.levelCardEtalon.clone(true);

	    	if (i == App.level.length-1){
	    					
	    		if (App.level[i] == 8) {

	    			levelCard.find("#levelWarning")[0].css("display:inline");
	    		}
	    		if (App.level[i] == 8) {

	    			levelCard.find("#levelWarning")[0].css("display:none");
	    			levelCard.find("#levelDanger")[0].css("display:inline");
	    		}
	    	}

	    	levelCard.find("#poolLevel")[0].innerHTML=i+1;
	    	levelCard.find(".bx-user").each(function(k){ 

	    		if (k<(App.level[i]-1)%3){

	    			$(this).addClass('text-shine-info');
	    		}
	    		else if ($(this).hasClass('text-shine-info')) {

	    			$(this).removeClass('text-shine-info')

	    		}

	    	})
	    	levelCard.find("#slots")[0].innerHTML=App.level[i]-1;
	    	levelCard.find("#reloads")[0].innerHTML=(App.level[i]-1 - (App.level[i]-1)%3)/3;
	    	levelCard.show();

	    	row.append(levelCard);
	    	if (i%4 == 3) {
	    		pools.append(row);
	    		row = $('<div class="row"></div>');;
	    	}

	    }

	    nextLevelCard.find("#buttonUnderline")[0].innerHTML="Level Up";
	    nextLevelCard.find("#poolLevel")[0].innerHTML=App.level.length+1;
			

    	$("#referals")[0].innerHTML = App.referalsLenght;
    	if (App.referalsPlus >0){
    		$("#referalsPlus").show();
    		$("#referalsPlus")[0].innerHTML ='+' + App.referalsPlus;
    	} else {
    		$("#referalsPlus").hide();
    	}

    	$("#network")[0].innerHTML = App.network;
    	if (App.networkPlus >0){
    		$("#networkPlus").show();
    		$("#networkPlus")[0].innerHTML ='+' + App.networkPlus;
    	} else {
    		$("#networkPlus").hide();
    	}

     	$(".nextLevelPrice").each(function(){this.innerHTML =  App.nextLevelPrice/10**18 ;});
     	nextLevelCard.find(".nextLevelPrice").each(function(){this.innerHTML =  App.nextLevelPrice/10**18;});

    	// Top Leader card data

    	if (App.topLeader == App.account) {

	    	topMess = 'You are Top Leader now!';
	    } else {

		    if (App.level.length < App.topMinimumLevel) {

		    	topMess = 	'Up level '+ App.topMinimumLevel;
		    }
		    if (App.topDelta <= App.topResult) {

		    	if (topMess.length > 0) { 

		    		topMess += ', invite ';
		    	} else { 

		    		topMess = 'Invite ';
		    	}

		    	let delta = App.topResult - App.topDelta;
		    	delta ++;
		    	topMess+= delta + ' <i class="bx bx-group"></i>';
		    }
		    if (topMess.length>0) {

		    	topMess += ' to become a Top Leader';

		    } else {

		    	topMess = 'Top Leader Data is loading...';
		    }
	  	}

  	} else {

			$("#regPrice")[0].innerHTML = App.newRegPrice;
    	$(".nextLevelPrice").each(function(){this.innerHTML =  App.newRegPrice});
    	nextLevelCard.find(".nextLevelPrice").each(function(){this.innerHTML =  App.newRegPrice;});
			let topRes = App.topResult;
			topRes++;
			topMess = 'Register, up level '+ App.topMinimumLevel+' and invite '+ topRes +' <i class="bx bx-group"></i> to become a Top Leader'
  	}

	  row.append(nextLevelCard);
	  pools.append(row);
    $("#topMess")[0].innerHTML = topMess;

    if (App.partnerId>0){
    	App.setModals('levelUp');
    } else {
    	App.setModals('registration');
    }


  },


  setDefaults: function (){

  	App.renderExchangeRates();
  	App.setModals('register');
  	App.showError(false);
	  var nextLevelCard = $("#nextLevelCard");
	  nextLevelCard.find("#buttonUnderline")[0].innerHTML="Registration";
	  nextLevelCard.find("#poolLevel")[0].innerHTML=1;
  	$("#userId")[0].innerHTML = '<span class="badge badge-danger">Wallet not registered</span>';
  	$("#level")[0].innerHTML = '0';
  	$("#referalsPlus").hide();
  	$("#income")[0].innerHTML ='0.00';
  	$("#incomePlus").hide();
  	$("#incomeCrypto")[0].innerHTML ='0.00';
  	$("#incomeCryptoPlus").hide();
  	$("#referals")[0].innerHTML ='0';
		$("#network")[0].innerHTML = '0';
		$("#networkPlus").hide();
		$("#directIncome")[0].innerHTML = '0.0000';
		$("#directIncomePlus").hide();
		$("#networkIncome")[0].innerHTML = '0.0000';
		$("#networkIncomePlus").hide();
		$("#lostProfit")[0].innerHTML = '0.0000';
		$("#lostProfitPlus").hide();

		$("#levelUpText")[0].innerHTML = 'Register Now';		

		$("#regPrice")[0].innerHTML = App.newRegPrice;
    
    $(".nextLevelPrice").each(function(){this.innerHTML =  App.newRegPrice/10**18;});
	  nextLevelCard.find(".nextLevelPrice")[0].innerHTML = App.newRegPrice/10**18;;
		var pools = $("#pools");
		if ($("#levelCard")) {

			App.levelCardEtalon = $("#levelCard").detach();
		}
		if ($("#messege")){
			App.messageHeight =$(".header-notifications-list").height();
			App.messegeEtalon = $("#messege").detach();
		}
  }

};

$(function () {
	"use strict"
	App.init().then(function () {
		new PerfectScrollbar('.header-notifications-list');	
		$(window).on("scroll", function () {
			if ($(this).scrollTop() > 60) {
				$('.top-header').addClass('bg-dark');
				$('.nav-container').addClass('bg-dark sticky-top-header');
			} else {
				$('.top-header').removeClass('bg-dark');
				$('.nav-container').removeClass('bg-dark sticky-top-header');
			}
		});
		$('.back-to-top').on("click", function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});
	$(function () {
		$('.metismenu-card').metisMenu({
			toggle: false,
			triggerElement: '.card-header',
			parentTrigger: '.card',
			subMenu: '.card-body'
		});
	});
	// Tooltips 
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
	// Metishmenu card collapse
	$(function () {
		$('.card-collapse').metisMenu({
			toggle: false,
			triggerElement: '.card-header',
			parentTrigger: '.card',
			subMenu: '.card-body'
		});
	});
	
	// toggle menu button
	$(".toggle-btn").click(function () {
		if ($(".wrapper").hasClass("toggled")) {
			// unpin sidebar when hovered
			$(".wrapper").removeClass("toggled");
			$(".sidebar-wrapper").unbind("hover");
		} else {
			$(".wrapper").addClass("toggled");
			$(".sidebar-wrapper").hover(function () {
				$(".wrapper").addClass("sidebar-hovered");
			}, function () {
				$(".wrapper").removeClass("sidebar-hovered");
			})
		}
	});
	
	 $(".toggle-btn-mobile").on("click", function () {
		$(".wrapper").removeClass("toggled");
	}); 
	// chat toggle
	$(".chat-toggle-btn").on("click", function () {
		$(".chat-wrapper").toggleClass("chat-toggled");
	});
	$(".chat-toggle-btn-mobile").on("click", function () {
		$(".chat-wrapper").removeClass("chat-toggled");
	});
	// email toggle
	$(".email-toggle-btn").on("click", function () {
		$(".email-wrapper").toggleClass("email-toggled");
	});
	$(".email-toggle-btn-mobile").on("click", function () {
		$(".email-wrapper").removeClass("email-toggled");
	});
	// compose mail
	$(".compose-mail-btn").on("click", function () {
		$(".compose-mail-popup").show();
	});
	$(".compose-mail-close").on("click", function () {
		$(".compose-mail-popup").hide();
	});
	// === sidebar menu activation js
	$(function () {
		for (var i = window.location, o = $(".metismenu li a").filter(function () {
			return this.href == i;
		}).addClass("").parent().addClass("");;) {
			if (!o.is("li")) break;
			o = o.parent("").addClass("").parent("").addClass("");
		}
	}),
	// metismenu
	$(function () {
		$('#menu').metisMenu();
	});
	/* Back To Top */
	$(document).ready(function () {
		$(window).on("scroll", function () {
			if ($(this).scrollTop() > 300) {
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});
		$('.back-to-top').on("click", function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});
	
});
/* perfect scrol bar */
//new PerfectScrollbar('.header-message-list');
