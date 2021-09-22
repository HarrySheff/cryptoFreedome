App = {
  web3Provider: null,
  contracts: {},
  account: '0x0000000000000000000000000000000000000000',
  crypto: "BNB",
  chainId: 0,
  chainName: 'Binance Smart Chain',
  mainChainId: '0x61', // '0x539',
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
  referrals: [],
  referralsPlus: 0,
  referralsLenght: 0,
  network: 0,
  networkStart: 0,
  networkPlus: 0,
  partnerId: 0,
  nextLevelPrice: [0, 0, 0],
  registrationBlock: 0,
  level: [],
  currentBlock:0,
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
	sponsorId: 1,
	mp:['Light', 'Smart', 'Prime'],
	registrationPrices: [],
	showNotificationsCount: 15,
	pricesUpdateInterval: 120,
	currentTimeToPricesUpdate: 120,
	roundId: 0,
	hasError: false,

	// An Error section show and hide function
	showError: function(show, title, text){

		if (show) {
			$("#error").addClass('d-flex');
			$("#error").show();
			$("#error h1")[0].innerHTML = title;
			$("#error p")[0].innerHTML = text;
			$(".nav-container").hide();
			$(".page-wrapper").hide();
  		$("#userIdContainer").hide();
  		$("#accountData").hide();
  		$("#messageContainer").hide();			

			$(".sidebar-header > a").hide();

		} else {
			$("#error").removeClass('d-flex');
			$("#error").hide();
			$(".nav-container").show();
			$(".page-wrapper").show();
			$("#userIdContainer").show();
			$(".sidebar-header > a").show();
  		$("#accountData").show();
  		$("#messageContainer").show();			
		}

	},

	// An app initiaion
  init:  async function() {

  	App.showError(true, "Loading...", "Waiting for the application loading.");
  	App.showRegistration(false);
  	App.setDefaults();
		console.log('--- App initiated ---');
		return App.initWeb3();
  },

  // Web3 initiation
  initWeb3: async function() {
    
    // Modern dapp browsers...
		if (window.ethereum) {
		  App.web3Provider = window.ethereum;
			window.ethereum.on('accountsChanged', (accounts) => {
				// Handle the new accounts, or lack thereof.
				// "accounts" will always be an array, but it can be empty.
				if (accounts.length === 0) {
					// the Wallet is locked or the user has not connected any accounts
					console.log('Please connect to the Wallet.');

					App.hasError = true;
					App.showError(true, 'the Wallet is Dissconnected', 'Plese connect to the Wallet and choose '+App.chainName+'.');

				} else if (accounts[0] !==  App.account) {
				  App.account = accounts[0];
				}
					  		 
				window.location.reload();
			});

			window.ethereum.on('chainChanged', (chainId) => {
			 	// Handle the new chain.
		  	// Correctly handling chain changes can be complicated.
			  // We recommend reloading the page unless you have good reason not to.

			  window.location.reload();
			});

		  try {
		  	console.log('--- Try request an account ---');
		  	App.showError(true, 'Login to the Wallet', "Please Login and allow the Criptolife access to it. ")

		    // Request account access

		    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		    
		    if (accounts && accounts.length > 0){
		    	App.account = accounts[0];
		    } else {

		    	App.hasError = true;
			    App.showError(true, 'Access denied...', 'Plese allow the Criptolife access to the Wallet.');
			    return App.render();
		    }

		  } catch (error) {
		    // User denied account access...
		    console.warn("User denied account access");

		    App.hasError = true;
		    App.showError(true, 'Access denied...', 'Plese allow the Criptolife access to the Wallet.');
		    return App.render();
		  }

		  try {

		  	App.chainId = await ethereum.request({ method: 'eth_chainId' });
		  } catch (error){
				Lobibox.notify('warning', {
					pauseDelayOnHover: true,
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: error.message
				});		
	  		console.warn(error);

	  		App.hasError = true;
	  		App.showError(true, 'Chain connection problem...', 'Plese check if the Wallet connected to '+App.chainName+'.');
	  		return App.render();

		  }

		  if (App.chainId !== App.mainChainId){


		  	App.hasError = true;
	  		App.showError(true, 'Connected to the wrong chain', 'Please connect to the '+App.chainName+' in the Wallet.');

	  		console.log(App.chainId);
	  		return App.render();

		  }
		}

		// Legacy dapp browsers...
		else if (window.web3) {
		  App.web3Provider = window.web3.currentProvider;
		  
		  let temp = await web3.eth.getAccounts();
			App.account = temp[0];

		}	else {

			// If no injected web3 instance is detected, connect to the testnet

		  App.web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
		  App.showError(true, 'No Wallet detected', "Please install the Wallet and connect to it. ");
		  App.hasError = true;
		  return App.render();
		}

		web3 = new Web3(App.web3Provider);		

		web3.eth.getBlockNumber(function(err, result){ 

			App.currentBlock = result;

			console.log('--- Web3 initiated ---');
			
			return App.initContract();

		});    
  },

 	// Initiate a Сontract
  initContract: function() {

  		App.showError(true, "Initiating Contract...", "Waiting for the Contract data.");
	    $.getJSON("../contracts/CryptoLife.json", function (data) {

	      // Instance a new truffle contract from the artifact
	      App.contracts.CryptoLife = TruffleContract(data);
	      
	      //Connect provider to interact with contract
	      App.contracts.CryptoLife.setProvider(App.web3Provider);

	      console.log('--- Contract initiated ---');
	      return App.initAccount();

	    });   
  },

  // A Current Address data load from cookies and wallet
  initAccount: async function(){


	  //Reading cookies function
		function getCookie(name) {
		// Set cookies sthring
		  let value = "; " + document.cookie;

		  // Split cookies string on parts with and without varible name
		  let parts = value.split("; " + name + "=");

		  // Check parts number
		  //Second part should starts from value of varible 
		  // If exist second part, return a value from start to splitter ";"
		  if (parts.length == 2) return parts.pop().split(";").shift();
		}

		function getRefiralFromLink() {

			// Split link on parts with and without arguments
			let valueParts = window.location.href.split("?");

			// Check parts number
			if(valueParts.length == 2) {

				// Arguments part exist

				// Set arguments string
				let value = "&"+valueParts[1];

			  // Split arguments string on parts with and without sponsor ID
			  let parts = value.split("&ref=");

			  // If exist second part, return a value from start to splitter "&"
			  if (parts.length == 2) return parseInt(parts.pop().split("&").shift(),10);

			}

			return 0;
		}



		//Get network number and convert it to number from string
		let temp = parseInt(getCookie( App.account+'_network'),10);
		if (temp != null && temp >0) {
			App.networkStart = temp;
			console.log( "network: " + App.networkStart);
		}


		// Get sponsor ID from link 
		temp = getRefiralFromLink();
		if (temp != null && temp >0) {
			App.sponsorId = temp;
			console.log( "sponsor ID: " + App.sponsorId);

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Save sponsor ID  in the cooke
			document.cookie = 'cryptolife_ref='+temp+'; path=/; expires=' + date;

		} else {
			temp = parseInt(getCookie( 'cryptolife_ref'),10);
			if (temp != null && temp >0) {
				App.sponsorId = temp;
				console.log( "sponsor ID: " + App.sponsorId);
			}
		}


		//Get referrals lenght and convert it to number from string
		temp = parseInt(getCookie( App.account+'_referrals'),10);
		if (temp != null && temp >0) {
			App.referralsLenght = temp;
			console.log( "referrals: " + App.referralsLenght);
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

		if (App.account == undefined){
			App.account = '0x0000000000000000000000000000000000000000';
		  console.log('No account receive from Wallet');
		  App.hasError = true;
		  App.showError(true, 'No access to the account', "Please check if the Wallet is Login and reload the page. ")
		  return App.render();
		} else {

	 		web3.eth.getBalance(App.account, web3.eth.defaultBlock, function(err, balance){
		        	
		  	if (err != null) {
					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: err.message
					});		  		
		    	console.log(err);
		  	} else {
		    	App.balance = balance;
		  	}
			});

			console.log('--- Account initiated ---');	
		}

  	return App.deployContract();
  },

  // The Contract deployment  
  deployContract: async function () {
  	
    // Get deployed contract

    App.contracts.CryptoLife.deployed().then(function(instance){
   		App.cryptoLife = instance;
   		console.log('--- Contract deployed ---');
   		return App.loadContractData();
    })
    .catch(function(error){
			Lobibox.notify('warning', {
				pauseDelayOnHover: true,
				icon: 'bx bx-error',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: error.message
			});
  		console.warn(error);
  		App.hasError = true;
  		App.showError(true, 'Contract not found...', 'Plese check if the Wallet connected to '+App.chainName+'.');
  		return App.render();
  	});
	},

	// Registration check the Сurrent address in the Сontract
	checkRegistration: async function(){

		let isRegistered = await	App.cryptoLife.isRegistered({from:App.account}).catch(function(error) {
					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: error.message
					});
		      console.warn(error);

		      return false;
		      
		    });

		return isRegistered;			
	},

	// Check the registration of the Сurrent address and load the corresponding data
	loadContractData: async function(init) {

		if (await App.checkRegistration()){

			await App.loadPartnerData();

 		} else {

			
			await web3.eth.getBlockNumber(function(err, blockNumber){
				App.registrationBlock = blockNumber; 
			});
		}

		await App.loadTopLeaderData();
		await App.loadRegistrationPrices();
		App.startPricesTimer();

		App.readPastEvents();

 		console.log('--- Contract Data loaded ---');

		return App.render();
	}, 

	// Load a Top Leader data and bonus progress from the Contract
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

			// Set required active marketing plan
			App.topMp = top[5];	

			// Set minimum required level 
			App.topMinimumLevel = top[6];	
		}		    		
  },

  // Load Partner's data from the Contract
  loadPartnerData: async function (toRender) {

				
			let partner = await	App.cryptoLife.getMyData({from:App.account}).catch(function(error) {

			  console.warn(error);

			  if(toRender) { return App.render()}
			      
			});

			if (partner != null && partner[0]>0){

				//Cookie expiration date
				let date = new Date;

				//Add one year
				date.setDate(date.getDate() + 360); 

				//Convert to UTC format
				date = date.toUTCString();
				    		
				App.partnerId = partner[0];
				App.level = [];
				App.level.push(partner[1]);
				if (partner[2].length > 0) {
					App.level.push(partner[2]);
					if (partner[3].length > 0) {
						App.level.push(partner[3]);
					}
				}
				App.date = partner[4];
				App.registrationBlock = partner[5];
				App.referrals = partner[6];
				App.referralsPlus = App.referrals.length - App.referralsLenght;
				App.networkPlus = partner[7] - App.networkStart;
				App.network = partner[7];
				App.nextLevelPrice = await App.cryptoLife.getNextLevelPrices(App.roundId.toString(), {from:App.account});
				   			
				document.cookie = App.account +'_network='+App.network+'; path=/; expires=' + date;

				document.cookie = App.account +'_referrals='+App.referrals.length+'; path=/; expires=' + date;
			
			}

		if(toRender) { return App.render()}
	},	

	// Read past events pagination function
	// Due to logs of 5000 blocks limitations in BSC 
	readPastEvents: async function (){

		// Set starting block number
		let blockToRead = App.registrationBlock*1;

		// Loop until the range of the last blocks is reduced to 5000
		while (App.currentBlock - blockToRead > 5000){

			// Listern events in the current range
			await App.listenForEvents(blockToRead, blockToRead+5000);

			// Increase start block number
			blockToRead+=5000;
		}

		// Return with listening new blocks
		return App.listenForEvents(blockToRead, 'latest');
	},			

	// Handle events of the Contract
  listenForEvents: async function(_startBlock, _endBlock){

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString();

	    // Conters to pr_event muliply renders
	    let missingBounusCount = 0;
			let missingBounusCounter = 0; 
			let bonusPaidOutCount = 0;
			let bonusPaidOutCounter = 0; 
			let poolReopenCount = 0;
			let poolReopenCounter = 0; 
			let referralsCount = 0;
			let referralsCounter = 0; 
	  	let levelUpCount = 0;
	  	let levelUpCounter = 0;

	  	// Largest seen block number
	  	let lastSeenBlockNumber = App.lastSeenBlock;

	  	function addNotification(_type, _title, _info, _event, _block){

				let mess = {};
				mess.type = _type;
				mess.title = _title;
				mess.info = _info;
				mess.dateTime =  _block.timestamp*1000; 
				mess.new = _event.blockNumber > App.lastSeenBlock;
				mess.logIndex = _event.logIndex;
					
					// Add new notiication to the list of notifications
					App.notifications.push(mess);				
	  	}

	  	function updateLastSeenBlock(_event){

				// Largest seen block check
				if (_event.blockNumber > lastSeenBlockNumber){

					// _Event's block number is largest

					// Set last seen block in the cooke
					document.cookie = App.account +'_lastSeenBlock='+_event.blockNumber+'; path=/; expires=' + date;
								
					// Set new largest block number
					lastSeenBlockNumber = _event.blockNumber;
				}	  		
	  	}

			// Catch bonus paid out
	    App.cryptoLife.bonusPaidOut(
	    		{partnerAddress: App.account},
	    		{fromBlock: _startBlock,
	    		toBlock: _endBlock},
	    		function (_error, _event){

	    		// Check for errors	
			    if (_error == null) {

			    	//No errors

			    	web3.eth.getBlock(_event.blockNumber, false, async function (_err, _block) {

				    	// Check a bonus type
							switch (_event.args.bonusType.toString()){

								case '1':

									// It's a direct bonus

									// Increment direct income summ								
									App.directIncome +=_event.args.amount/10**18;

									// Check for new income									    	
									if (_event.blockNumber > App.lastSeenBlock) {

										// An income is new 
										
										//Increase a direct income plus summ	  
										App.directIncomePlus += _event.args.amount/10**18;
											
									}

									// Add new nitification to the list of notifications 
									addNotification(
										'directBonus', 
										'Direct bonus ' + (_event.args.amount/10**18).toFixed(6)+' '+App.crypto, 'Level '+_event.args.level+' '+ App.mp[_event.args.mp]+' slot was taken by a Partner.',
										_event,
										_block
										);
							    	
								break;

								case '0':

									// It's a Top Leader bonus

									// Increment network income summ											
									App.networkIncome += _event.args.amount/10**18;
									
									// Check for new income		    	
									if (_event.blockNumber > App.lastSeenBlock) {

										// An income is new 
										
										//Increase a network income plus summ	  										  
										App.networkIncomePlus += _event.args.amount/10**18;
									}

									// Add new nitification to the list of notifications
									addNotification(
										'leaderBonus',
										'Top Leader bonus received!',
										'Congratulations Top Leader! Your bonus is '+(_event.args.amount/10**18).toFixed(6)+' '+App.crypto+'.<br>Keep growing & take the next one too!',
										_event,
										_block
										);

								break;

								default:
									App.networkIncome += _event.args.amount/10**18;
									if (_event.blockNumber > App.lastSeenBlock) {
										App.networkIncomePlus += _event.args.amount/10**18;
									}	

									// Add new nitification to the list of notifications
									addNotification(
										'networkBonus',
										'Network bonus ' +(_event.args.amount/10**18).toFixed(6)+' '+App.crypto, 'A Prtner at depth '+_event.args.bonusType+' took a Level '+_event.args.level+' '+ App.mp[_event.args.mp]+' slot.',
										_event,
										_block
										);

								break;					    	
							}

							// Update a last seen block
							updateLastSeenBlock(_event);

							// Increase an _events counter
							bonusPaidOutCounter++;

			    		// Compare counted _events number with total past events number
							if ((bonusPaidOutCount > 0 && bonusPaidOutCount == bonusPaidOutCounter)) {
		
								// Check for new event							
								if (_event.blockNumber > App.currentBlock){

									//The event is new and have to update rendered info

									// Check for Top Leader Bonus paied event
									if (_event.args.bonusType.toString() == '0'){

										// This is a Top Leader Bonus paid event

										// Update Top Leader Bonus data
										await App.loadTopLeaderData();

										// Render Total Income
										App.changheCurrentCurrency(App.currentCurrency);

										// Render Incomes
										App.renderIncomes();

										// Render next Top Leader Bonus progress
										App.renderTopLeaderBonusProress();

									} else if (_event.args.bonusType.toString() == '1') {

										await App.loadPartnerData(true);

									} else {

										// Render Total Income
										App.changheCurrentCurrency(App.currentCurrency);

										// Render Incomes
										App.renderIncomes();

									}

								} else {
										
									// Render Total Income
									App.changheCurrentCurrency(App.currentCurrency);

									// Render Incomes
									App.renderIncomes();

								}

								// Render notifications
								App.renderNotifications();

							}

						});
														
					} else {

						// Something wrong and has an error

						// Show an error popup
						Lobibox.notify('warning', {
							pauseDelayOnHover: true,
							icon: 'bx bx-error',
							continueDelayOnInactiveTab: false,
							rounded: true,
							position: 'top center',
							msg: _error
						});

						// Lod the error message
						console.log("_Event error: "+ _error);
					}
	    }).watch(function(){bonusPaidOutCount ++;});
	  	
	  	// Chatch lost profit
	  	App.cryptoLife.missingBounus(
	    	{partnerAddress: App.account},
	    	{fromBlock: _startBlock,
	    	toBlock:_endBlock}, 
	    	function (_error, _event){

				App.lostProfit += _event.args.amount/10**18;
			
				if (_event.blockNumber > App.lastSeenBlock) {
							    	
					App.lostProfitPlus += _event.args.amount/10**18;

				}

			  web3.eth.getBlock(_event.blockNumber, false, async function (_err, _block) {

			  	let temp = '';

					// Check a bonus type
			    switch (_event.args.bonusType.toString( )){
			    	case '1':

			    		if (_event.args.level == 1) {
			    			temp = 'Activate '+App.mp[_event.args.mp];
			    		} else if (App.level.length-1 < _event.args.mp) {
			    			temp = 'Activate '+App.mp[_event.args.mp] + ' and raise its Level to '+ _event.args.level;
			    		} else {
			    			temp = 'Raise the level of '+App.mp[_event.args.mp]+' to '+ _event.args.level;
			    		}

			    		// Add new nitification to the list of notifications
			    		addNotification(
								'missed',
								(_event.args.amount/10**18).toFixed(6)+' '+App.crypto+' of profit lost',
								temp +'<br>to receive '+App.mp[_event.args.mp]+' Level ' +  _event.args.level + ' bonuses.',
								_event,
								_block
								);

			    	break;

			    	default:

			    		
			    		if (_event.args.bonusMp == 2 && _event.args.bonusType < 4){
			    			temp = 'additional ';
			    		}

			    		// Add new nitification to the list of notifications
			    		addNotification(
								'missed',
								(_event.args.amount/10**18).toFixed(6)+' '+App.crypto+' of profit lost',
								'Activate '+App.mp[_event.args.bonusMp]+' to receive '+temp+'<br>network bonuses at a depth of '+_event.args.bonusType+'.',
								_event,
								_block
								);

			    	break;	
			    } 
		    	

					// Update a last seen block
					updateLastSeenBlock(_event);

					// Increase an _events counter
		    	missingBounusCounter++;

			   	// Compare counted _events number with total past events number
					if ((missingBounusCount > 0 && missingBounusCount == missingBounusCounter)) {

						// Data of all past _events processed or new _event

						// Update and render incomes 
						App.renderIncomes();

						// Update and render notifications
						App.renderNotifications();
					}
				});

   	  }).watch(function(){missingBounusCount ++;});

	  	// Chatch pool reopen
	  	App.cryptoLife.poolIsReopened(
	    	{partnerAddress: App.account},
	    	{fromBlock: _startBlock,
	    	toBlock:_endBlock}, 
	    	function (error, _event){

			  web3.eth.getBlock(_event.blockNumber, false, function (_err, _block) {

			    addNotification(
						'reopen'+_event.args.mp,
						'Reopen of the pool',
						'Your '+App.mp[_event.args.mp]+' Level '+_event.args.level+' pool was reopened.',
						_event,
						_block
						);

					// Update a last seen block
					updateLastSeenBlock(_event);

					// Increase an _events counter
			    poolReopenCounter++;

			    // Compare counted _events number with total past events number
					if ((poolReopenCount > 0 && poolReopenCount == poolReopenCounter)) {
														
						App.loadPartnerData(true);

					}	

				});	    	

   	  }).watch(function(){poolReopenCount ++;});;

	  	// Chatch user registration
	  	App.cryptoLife.registration(
	    	{partnerAddress: App.account},
	    	{fromBlock: _startBlock,
	    	toBlock:_endBlock}, 
	    	function (error, _event){

			  web3.eth.getBlock(_event.blockNumber, false, async function (_err, _block) {
				
					// Check a marketing plan   	
			    switch (_event.args.mp.toString()) {
			    	case '0' :

			    		// Add new nitification to the list of notifications
			    		addNotification(
								'registration',
								'Registration complete',
								'Your Criptolife starts right now!<br>You have 3 '+App.mp[0] +' level 1 slots to start.',
								_event,
								_block
								);		    		
			    	break;
			    	case '1' :

			    		// Add new nitification to the list of notifications
			    		addNotification(
								'registration1',
								App.mp[1] + ' activated',
								'You have 3 '+App.mp[1] +' level 1 slots & network<br> bonuses unlocked to depth 3 now.',
								_event,
								_block
								);

			    	break;
			    	case '2' :
		
				    	// Add new nitification to the list of notifications
			    		addNotification(
								'registration2',
								App.mp[2] + ' activated',
								'You have 3 '+App.mp[2] +' level 1 slots & full network<br> bonuses unlocked now.',
								_event,
								_block
								);
			
			    	break;
			    }

					// Update a last seen block
					updateLastSeenBlock(_event);

					//Check for new event
			    if (_event.blockNumber > App.currentBlock) {

			    	// This is a new registration or marketing plan activation

			    	// Update Top Leader bonus progress data
						await App.loadTopLeaderData();

						// Update data of the Parnter and render all
						await App.loadPartnerData(true);
			    } else {

			    	App.renderNotifications();
			    }

			  });

   	  });

	  	// Catch new referral registration
	  	App.cryptoLife.registration(
	    	{sponsorAddress: App.account},
	    	{fromBlock: _startBlock,
	    	toBlock:_endBlock}, 
	    	function (error, _event){

	    	if (_event.args.sponsorAddress != _event.args.partnerAddress) {

				  web3.eth.getBlock(_event.blockNumber, false, async function (_err, _block) {

		    		// Check a marketing plan   
				    switch (_event.args.mp.toString()){
				    	case '0':

				    		// Add new nitification to the list of notifications
				    		addNotification(
									'referral',
									'New referral registered',
									'You have new referral with ID '+ _event.args.partnerID+'.',
									_event,
									_block
									);

				    	break;
				    	default:

				    		// Add new nitification to the list of notifications
				    		addNotification(
									'referralUpMp'+_event.args.mp,
									'Referral activated '+App.mp[_event.args.mp],
									'Your referral with ID '+ _event.args.partnerID+' has '+App.mp[_event.args.mp]+' active now.',
									_event,
									_block
									);

				    	break;		    		
				    }

						// Update a last seen block
						updateLastSeenBlock(_event);

				    referralsCounter++;
						if ((referralsCount > 0 && referralsCount == referralsCounter)) {
															
							await App.loadTopLeaderData();	
							await App.loadPartnerData(true);

						}				    	
			    });
				}	
   	  }).watch(function(){referralsCount ++;});

	  	// Chatch user level up
	  	App.cryptoLife.levelUp(
	    	{partnerAddress: App.account},
	    	{fromBlock: _startBlock,
	    	toBlock:_endBlock}, 
	    	function(error, _event){

				web3.eth.getBlock(_event.blockNumber, false, async function (_err, _block) {

			    let temp =' ';
			    if (_event.args.level > 2) {
			   		temp = ' & less<br>';
			    }
				  
				  // Add new nitification to the list of notifications
				  addNotification(
						'levelUp'+_event.args.mp,
						'You\'ve reached '+App.mp[_event.args.mp]+' Level '+ _event.args.level,
						'Reopens of '+App.mp[_event.args.mp]+' pools Level '+ (_event.args.level-1) +temp+'unlimited now.',
						_event,
						_block
						);

					// Update a last seen block
					updateLastSeenBlock(_event);

					levelUpCounter++;
					if ((levelUpCount > 0 && levelUpCount == levelUpCounter)) {

									
						if (_event.blockNumber > App.currentBlock){
								
							await App.loadPartnerData(true);

						} else {

							App.renderNotifications();
						}
							
					}
				});
	    }).watch(function(){levelUpCount ++;});



   	 console.log('--- Event listeners initiated ---');   	  
  },

  // Load Registration prices from the Contract
  loadRegistrationPrices: async function (){

    App.registrationPrices =[];
	 	let temp = await App.cryptoLife.getRegistrationPrices(App.roundId.toString()).catch(function(error){

	 		console.warn(error);
	 	});
  		
  	App.registrationPrices = temp[0];

  	for (let i=0; i<App.registrationPrices.length; i++) {
  		App.registrationPrices[i] = App.registrationPrices[i]/10**18;
  		if (i>0){
  			App.registrationPrices[i]+=App.registrationPrices[i-1];
  		}

  	}

  	App.roundId = temp[1];
  	
  	console.log("--- Registration prices loaded ---");
  },

  // Start prices udate timer
  startPricesTimer: function(){

  	// Start timer in seconds
  	let timer = setInterval(async function(){

  		if (App.currentTimeToPricesUpdate <=0){

  			// Remove timer
  			clearInterval(timer);

  			// Show zero time
  			$(".timer").each(function(){this.innerHTML = 0;});

  			// Update Exchange rates in the header
  			App.renderExchangeRates();			

  			// Check for shown section
  			if (App.partnerId > 0){

  				// Account section should be visible

  				await App.loadRegistrationPrices();

  				App.nextLevelPrice = await App.cryptoLife.getNextLevelPrices(App.roundId.toString(), {from:App.account});

  				App.renderPrices();

  			}else{ 

  				// Registration section should be visible

  				// Show loader spiners insted prices

  				// Loop registration prices
		  		for (i = 0; i<App.registrationPrices.length; i++){

		  			// Set a selector for current price
		  			let selector = ".mp"+i+"Price";

		  			// Show a spiner
		  			$(selector).each(function(){this.innerHTML ='<span class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></span>';});
		  			
		  		}

		  		// Load registration prices
		  		App.loadRegistrationPrices().then(function(){

		  			// Update prices after load

		  			// Loop registration prices
			  		for (i = 0; i<App.registrationPrices.length; i++){

			  			// Set a selector for current price
			  			let selector = ".mp"+i+"Price";

			  			// Show the price
			  			$(selector).each(function(){this.innerHTML =App.registrationPrices[i].toFixed(6);});  			
			  		}

		  		});  				

  			}

			  App.currentTimeToPricesUpdate = App.pricesUpdateInterval;
			  App.startPricesTimer();  
  		} else {
  			$(".timer").each(function(){this.innerHTML = App.currentTimeToPricesUpdate;});
  		}
  		--App.currentTimeToPricesUpdate;

  	},1000);
  },

  // Level up function
  levelUp: async function (mp, levelUp){
 		if (levelUp) {

 				Lobibox.notify('success', {
					pauseDelayOnHover: true,
					icon: 'bx bx-chevrons-up',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: 'Sign the transaction at the Wallet!<br>When it is mined, your account will update automatically.'
				});

			App.cryptoLife.partnerLevelUp(mp, 1, App.roundId.toString(), {from:App.account, value:App.nextLevelPrice[mp]}).catch(function(error){
					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: error.message
					});
					console.warn(error);
 				});

 		} else {

 			let price = 0;
 			if(App.partnerId >0){
 				price = App.nextLevelPrice[mp];
 			} else {
 				price = App.registrationPrices[mp]*10**18;
 			}

 			if (App.balance/10**18 > price/10**18) {

 				Lobibox.notify('success', {
					pauseDelayOnHover: true,
					icon: 'bx bx-check-double',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: 'Sign the transaction at the Wallet!<br>When it is mined, you will be redirected to your personal account automatically.'
				});

	 			App.cryptoLife.registerNewPartner( App.sponsorId, mp, App.roundId.toString(), {from:App.account, value:price}).then(function(){
				
	 			}).catch(function(error){
					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: error.message
					});
	 			});
	 		} else {

				Lobibox.notify('warning', {
					pauseDelayOnHover: true,
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: 'Not enough '+ App.crypto +' at the balance to pay for Registration.<br>Please deposit some '+ App.crypto+' and try agan.'
				});

	 		}
 		}
 	},

 	// Current currency change function
  changheCurrentCurrency: function (currency){

    	$('#currentExchangeRate')[0].innerHTML= App.exchange[currency].toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    	$('#income')[0].innerHTML= (App.exchange[currency]*(App.directIncome + App.networkIncome)).toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    	if (App.directIncomePlus + App.networkIncomePlus>0)
    	{
    		
    		$('#incomePlus')[0].innerHTML= '+' + (App.exchange[currency]*(App.directIncomePlus + App.networkIncomePlus)).toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    		$('#incomePlus').show();

    	}else {

    		$('#incomePlus').hide();
    	}
      $('.current-currency').each(function(){$(this).attr('class', App.currencyIconClass[currency] + " current-currency");});
      //$('#current-currency-income').attr('class', App.currencyIconClass[currency]);
      App.currentRate = App.exchange[currency];
      App.currentCurrency = currency;
  },

  // Render an Exchanre rates list in the header section
  renderExchangeRates: function (){

  	var requestURL = 'https://min-api.cryptocompare.com/data/price?fsym='+App.crypto+'&tsyms=USD,ILS,JPY,EUR,WAN,RUB,GBP ';
		var request = new XMLHttpRequest();
		request.open('GET', requestURL);
		request.responseType = 'json';
		try{

			request.send();

		} catch(error){
			Lobibox.notify('warning', {
				pauseDelayOnHover: true,
				icon: 'bx bx-error',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: error.message
			});
			console.log(error);
		}
		request.onload = function() {
			App.exchange = request.response;

	  	$("#USD span")[0].innerHTML = App.exchange.USD.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			$("#EUR span")[0].innerHTML = App.exchange.EUR.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');		
			$("#ILS span")[0].innerHTML = App.exchange.ILS.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			$("#GBP span")[0].innerHTML = App.exchange.GBP.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			$("#JPY span")[0].innerHTML = App.exchange.JPY.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			$("#WAN span")[0].innerHTML = App.exchange.WAN.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			$("#RUB span")[0].innerHTML = App.exchange.RUB.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
			App.changheCurrentCurrency(App.currentCurrency);
		}    
  },

  initExchangeRates: function(){

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

    App.renderExchangeRates();
  },

  // Render a Notifications list in the header section
  renderNotifications: function () {

  	let newsCount = 0;
  	let notificationsList = $("#header-notifications-list");
  	notificationsList.empty();
  	App.notifications = App.notifications.sort(function(a,b){

  		let dif = new Date(b.dateTime) - new Date(a.dateTime);
  		if (dif != 0 ){
  			return dif;
  		}
  		else {
  			return b.logIndex - a.logIndex;
  		}
  		

  	});


  	for(let i = 0; i<App.notifications.length; i++){

  		let mess = App.messegeEtalon.clone(true);
  

  		if (App.notifications[i].new) {

  			newsCount ++;
  		}

  		// Show only last 10 messages
  		if (i <= App.showNotificationsCount) {


	  		switch (App.notifications[i].type){
	  			case 'registration': 
	  				mess.find("#messIcon i").attr("class",'bx bx-check-double');
	  				mess.find("#messIcon").attr("class",'notify bg-white text-primary');

	  			break;
	  			case 'registration1': 
	  				mess.find("#messIcon i").attr("class",'bx bx-check-double');
	  				mess.find("#messIcon").attr("class",'notify bg-info text-white');

	  			break;
	  			case 'registration2': 
	  				mess.find("#messIcon i").attr("class",'bx bx-check-double');
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');

	  			break;
	  			case 'referral': 
	  				mess.find("#messIcon i").attr("class",'bx bx-user-plus');
	  				mess.find("#messIcon").attr("class",'notify bg-white text-primary');

	  			break;
	  			case 'referralUpMp1': 
	  				mess.find("#messIcon i").attr("class",'bx bx-user-plus');
	  				mess.find("#messIcon").attr("class",'notify bg-info text-white');

	  			break;
	  			case 'referralUpMp2': 
	  				mess.find("#messIcon i").attr("class",'bx bx-user-plus');
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');

	  			break;	  			
	  			case 'reopen0': 
	  				mess.find("#messIcon i").attr("class",'bx bx-rotate-left');
	  				mess.find("#messIcon").attr("class",'notify bg-white text-primary');
	  			break;
	  			case 'reopen1': 
	  				mess.find("#messIcon i").attr("class",'bx bx-rotate-left');
	  				mess.find("#messIcon").attr("class",'notify bg-info text-white');
	  			break;
	  			case 'reopen2': 
	  				mess.find("#messIcon i").attr("class",'bx bx-rotate-left');
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');
	  			break;	  			
	  			case 'directBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-money');
						mess.find("#messIcon").attr("class",'notify bg-success text-white');

	  			break;
	  			case 'networkBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-coin');
	  				mess.find("#messIcon").attr("class",'notify bg-success text-white');

	  			break;
	  			case 'leaderBonus': 
	  				mess.find("#messIcon i").attr("class",'bx bx-trophy');
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');

	  			break;
	  			case 'missed': 

	  				mess.find("#messIcon i").attr("class",'bx bx-error');  
	  				mess.find("#messIcon").attr("class",'notify bg-youtube text-white');

	  			break;
	  			case 'levelUp0': 
	  				mess.find("#messIcon i").attr("class",'bx bx-sort-up'); 
	  				mess.find("#messIcon").attr("class",'notify bg-white text-primary');
	  			break;
	  			case 'levelUp1': 
	  				mess.find("#messIcon i").attr("class",'bx bx-sort-up'); 
	  				mess.find("#messIcon").attr("class",'notify bg-info text-white');
	  			break;
	  			case 'levelUp2': 
	  				mess.find("#messIcon i").attr("class",'bx bx-sort-up'); 
	  				mess.find("#messIcon").attr("class",'notify bg-warning text-white');
	  			break;
	   		}

	  		mess.find("#messTitle")[0].innerHTML = App.notifications[i].title;

	  		let messDate = new Date(App.notifications[i].dateTime).toLocaleString();

	   		mess.find("#messDateTime")[0].innerHTML = messDate.substr(0, messDate.indexOf(','));

	   		mess.find(".msg-info")[0].innerHTML = App.notifications[i].info;

	  		notificationsList.append(mess);
  		}
  	}

  	let bageCount;
  	if(newsCount>9){
  		bageCount = '9+';
  	} else {
  		bageCount = newsCount;
  	}
  	$("#newMessBage")[0].innerHTML = bageCount;
  	$("#newMessCount")[0].innerHTML = newsCount;
  	$("#showMessCount")[0].innerHTML = (App.notifications.length<App.showNotificationsCount)?App.notifications.length:App.showNotificationsCount;

  	if (newsCount == 0) {

  		$("#newMessBage").addClass('bg-gray').addClass("text-dark");
  	} else {
  		$("#newMessBage").removeClass('bg-gray').removeClass("text-dark");
  	}

  	// Set a notification list heigth fit to messages count
  	// Should find more suitable metod to calculate haeigt

  	let listHeight = 0;
  	
  	if (App.notifications.length <5){
  		listHeight = App.notifications.length*App.messageHeight;
  	} else {
  		listHeight = 5*App.messageHeight;
  	}

		// Set height of the notification list
  	$(".header-notifications-list").height(listHeight);
  },

  // Set modals windows data for all sections
  setModals: function(){

  		$(".levelUpButton").each(function(){this.setAttribute('data-target','#levelUpModal'); });
  		
  		if (App.partnerId>0) {
	  		$(".modalLevel").each(function(){this.innerHTML = App.level[0].length+1});
	  		$("#modalCurrentLevel")[0].innerHTML = App.level[0].length;
	  		if (App.level.length > 1){
	  				$(".levelUpFastButton").each(function(){
	  					this.setAttribute('data-target','#levelUpFastModal'); 
	  					$(this).find('i').removeClass('bx-check-double').addClass('bx-chevrons-up');
	  					$(this).find("span")[0].innerHTML = "Level Up";
	  				});
	  				$(".modalLevelFast").each(function(){
	  					this.innerHTML = App.level[1].length+1;
	  				});
	  				$("#modalCurrentLevelFast")[0].innerHTML = App.level[1].length;
	   			if (App.level.length>2){
	  				$(".levelUpVipButton").each(function(){
	  					this.setAttribute('data-target','#levelUpVipModal'); 
	  					$(this).find('i').removeClass('bx-check-double').addClass('bx-chevrons-up');
	  					$(this).find("span")[0].innerHTML = "Level Up";
	  				});
	  				$(".modalLevelVip").each(function(){this.innerHTML = App.level[2].length+1});
	  				$("#modalCurrentLevelVip")[0].innerHTML = App.level[2].length;
	   			} else {

	   				$(".levelUpVipButton").each(function(){
	   					this.setAttribute('data-target','#registrationVipModal');
	   					$(this).find('i').removeClass('bx-chevrons-up').addClass('bx-check-double');
	   					
	   				});
	   				$(".levelUpVipText").each(function(){this.innerHTML="Activate";});
	   			}
	  		} else {
	  			$(".levelUpFastText").each(function(){this.innerHTML="Activate";});
	  			$(".levelUpVipText").each(function(){this.innerHTML="Activate";});
	  			$(".levelUpFastButton").each(function(){
	  				this.setAttribute('data-target','#registrationFastModal');
	  				$(this).find('i').removeClass('bx-chevrons-up').addClass('bx-check-double');
	  			});
	   			$(".levelUpVipButton").each(function(){
	   				this.setAttribute('data-target','#registrationVipModal');
	   				$(this).find('i').removeClass('bx-chevrons-up').addClass('bx-check-double');
	   					
	   			});  			
	  		}
  		}
  		
  		$('#modalLevelUpBtn').off('click').on('click', function(){App.levelUp(0, true);});
  		$('#modalLevelUpFastBtn').off('click').on('click', function(){App.levelUp(1, true);});
		  $('#modalLevelUpVipBtn').off('click').on('click', function(){App.levelUp(2, true);});
	
  		$(".registrationModal").each(function(k){

  			temp = k>0 && App.partnerId>0;
	  		$(this).find('#modalRegistrationBtn').off('click').on('click',function(){
	  				App.levelUp(k, temp);  			
	  		});
	  		if (temp){
	  			$(this).find(".registrationText").each(function(){
	  				this.innerHTML = "Activation";
	  			})
	  		}

  		});
  },

  // Show a New Partner registration section of the page
  showRegistration: function(show) {

  	if (show) {

  		for (i = 0; i<App.registrationPrices.length; i++){

  			let selector = ".mp"+i+"Price";
  			$(selector).each(function(){this.innerHTML = App.registrationPrices[i].toFixed(6);});
  			
  		}

  		$("#regTopLederBonus")[0].innerHTML = App.topBonusSumm/10**18;

  		$("#registration").show();
  		$("#userIdContainer").hide();
  		$("#accountData").hide();
  		$("#messageContainer").hide();
			$(".nav-container").hide();
  	} else {

  		$("#registration").hide();
  		$("#userIdContainer").show();
  		$("#accountData").show();
 			$("#messageContainer").show();
 			$(".nav-container").show();
  	}
  },
 
  // Render an Incomes block of the Account section 
  renderIncomes: function(){

		$("#directIncome")[0].innerHTML = App.directIncome.toFixed(6);
	  if (App.directIncomePlus >0){
	    $("#directIncomePlus").show();
	    $("#directIncomePlus")[0].innerHTML ='+' + App.directIncomePlus.toFixed(6);
	  } else {
	    $("#directIncomePlus").hide();
	  }

	  $("#networkIncome")[0].innerHTML = App.networkIncome.toFixed(6);
	  if (App.networkIncomePlus >0){
	    $("#networkIncomePlus").show();
	    $("#networkIncomePlus")[0].innerHTML ='+' + App.networkIncomePlus.toFixed(6);
	  } else {
	    $("#networkIncomePlus").hide();
	  }

	  $("#incomeCrypto")[0].innerHTML = (App.directIncome + App.networkIncome).toFixed(6);
	  if (App.networkIncomePlus + App.directIncomePlus >0){
	    $("#incomeCryptoPlus").show();
	    $("#incomeCryptoPlus")[0].innerHTML ='+';
	    $("#incomeCryptoPlus")[0].innerHTML += (App.networkIncomePlus + App.directIncomePlus).toFixed(6);
	  } else {
	    $("#incomeCryptoPlus").hide();
	  }

	  $("#lostProfit")[0].innerHTML = App.lostProfit.toFixed(6);
	  if (App.lostProfitPlus >0){
	    $("#lostProfitPlus").show();
	    $("#lostProfitPlus")[0].innerHTML ='+' + App.lostProfitPlus.toFixed(6);
	  } else {
	    $("#lostProfitPlus").hide();
	  }  	
  },

  // Render a Top Leader bonus progress block of the Account section
  renderTopLeaderBonusProress: function(){
    
    // Top Leader card data

    let topMess ='';
    if (App.topLeader == App.account) {

	   	topMess = 'You are Top Leader now!';
	  } else {

		  if (App.level.length < 3 || App.level[2].length < App.topMinimumLevel) {

		   	topMess = 	'Up '+App.mp[2]+' to the Level '+ App.topMinimumLevel;
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

	    if (topMess.length > 45){

	    	$("#topMess").removeClass("mb-3").addClass("m-0");
	   	 	$(".list-group-flush").each(function(){$(this).removeClass("mb-0").addClass("mb-1")});
	  	}
	 	}

 		$("#topMess")[0].innerHTML = topMess;
  },

  // Render refferal links
  renderRefferalLinks: function(){

  	$("#userIdContainer .dropdown-menu a").each(function(_number){

  			$(this).off('click').on('click', function(){reffealAction(_number)});
  	});
  	
  	function reffealAction(_number){
  		switch(_number){

  			case 0: 
  				navigator.clipboard.writeText(window.location.host+'?ref='+App.partnerId);
		   		Lobibox.notify('success', {
						pauseDelayOnHover: false,
						icon: 'bx bx-copy',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: 'Refferal link is copied to the clipboard.'
					});						
  			break;
  			case 1: 
  				navigator.clipboard.writeText(window.location.host+'/account.html?ref='+App.partnerId);
		   		Lobibox.notify('success', {
						pauseDelayOnHover: false,
						icon: 'bx bx-copy',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: 'Direct registration link is copied to the clipboard.'
					});						
  			break;
  			case 5:
  				window.open('https://www.facebook.com/sharer.php?u='+window.location.host+'?ref='+App.partnerId,'sharer','status=0,toolbar=0,width=650,height=500');
  			break;
  		}
  	}
  },

  // Render prices
  renderPrices: function(){

  	$(".levelCard").each(function(i){

	    $(this).find("#levelPrice")[0].innerHTML = (App.registrationPrices[0]*2**i).toFixed(6);
	    let fastRegPrice = App.registrationPrices[1] - App.registrationPrices[0];
	    let vipRegPrice = App.registrationPrices[2] - App.registrationPrices[1];	    	
	    $(this).find(".levelFastPrice").each(function(){this.innerHTML = (fastRegPrice*2**i).toFixed(6);});
			$(this).find(".levelVipPrice").each(function(){this.innerHTML = (vipRegPrice*2**i).toFixed(6);});  	
  	});
	  $(".nextLevelPrice").each(function(){this.innerHTML = (App.nextLevelPrice[0]/10**18).toFixed(6)});
	  $(".nextLevelPriceFast").each(function(){this.innerHTML = (App.nextLevelPrice[1]/10**18).toFixed(6)});
	  $(".nextLevelPriceVip").each(function(){this.innerHTML = (App.nextLevelPrice[2]/10**18).toFixed(6)});

  },

  // Render an Account section of the page
  render: function() {

  	$('#balance')[0].innerHTML = (App.balance/10**18).toFixed(6);
  	$('#cryptoLogo').attr("src","img/"+App.crypto+".svg");
  	App.renderExchangeRates();

  	if (App.account.length > 12) {
  		$("#userAccount")[0].innerHTML = App.account.substr(0,12)+'...'+App.account.substr(App.account.length-10);
  	}
    
    if (App.account != '0x0000000000000000000000000000000000000000'){
	    $("#userAccountBage").removeClass("badge-danger").addClass("badge-success");
	    $("#userAccountBage")[0].innerHTML = "Online";    	
    }

    if (!App.hasError){
    	App.showError(false);
	  	if ( App.partnerId >0) {
		
				App.showError(false);
		  	var nextLevelCard = $("#nextLevelCard").detach();  
			  var pools = $("#pools");

			  pools.empty();
			  var row = $('<div class="row"></div>');

		    $("#topSumm")[0].innerHTML = App.topBonusSumm/10**18;
		    $("#topResult")[0].innerHTML = App.topResult;
		    $("#topLeaderBar").css("width", App.topBalance/App.topBonusSumm*100+"%");

	  		$("#userId")[0].innerHTML = App.partnerId;

	  		App.showRegistration(false);
	  		App.renderNotifications();
	  		App.renderIncomes();
	  		App.renderTopLeaderBonusProress();
	  		App.renderRefferalLinks();

	    	// Set a text on the Basic level up button
	    	$(".levelUpText").each(function(){ this.innerHTML = 'Level Up';});

	    	// Set a current level of the Basic marketing plan
	    	$("#level")[0].innerHTML = App.level[0].length;

	     	// Check level of the Fast marketing plan
	    	if(App.level.length>1){

	    		// Set a text on the Fast level up button
	    		$(".levelUpFastText").each(function(){ this.innerHTML = 'Level Up';});

	    		// Show a current level of the Fast marketing plan
	    		$("#levelFast").show();

	    		// Set a current level of the Fast marketing plan
	    		$("#levelFast span")[0].innerHTML = App.level[1].length;

	    	}		

	    	// Check level of the VIP marketing plan
	    	if(App.level.length>2){

	    		// Set a text on the VIP level up button
	    		$(".levelUpVipText").each(function(){ this.innerHTML = 'Level Up';});

	    		// Show a current level of the VIP marketing plan
	    		$("#levelVip").show();	

	    		// Set a current level of the VIP marketing plan
	    		$("#levelVip span")[0].innerHTML = App.level[2].length;
	    	}	



		    for (i = 0; i<App.level[0].length; i++){

		    	let levelCard = App.levelCardEtalon.clone(true);

		    	let levelNumber = i+1;

		    	for (mp = 0; mp < App.level.length; mp++){

		    		let selector = '';
				    let slotNumber = 0;
				    let mpMaxLevel = 0;
				    switch (mp) {
				    	case 0: selector = "#basic";
				    		slotNumber = App.level[0][i];
				    		mpMaxLevel = App.level[0].length;
				    	break;
				    	case 1:  selector = "#fast";
				    		slotNumber = App.level[1][i];
				    		mpMaxLevel = App.level[1].length;
				    	break;
				    	case 2:  selector = "#vip";
				    		slotNumber = App.level[2][i];
				    		mpMaxLevel = App.level[2].length;
				    	break;
				    }

				    let slotsTooltip = levelCard.find(selector +" #slotsTooltip");
				    let reopensTooltip = levelCard.find(selector +" #reopensTooltip");
				    let priceTooltip = levelCard.find(selector + " #priceTooltip");
				    slotsTooltip.attr('data-original-title', "Total number of "+App.mp[mp]+" Slots taken by partners at the Level.");
				    slotsTooltip.css('cursor','pointer');
				    slotsTooltip.attr('data-placement',"bottom").tooltip();

				    priceTooltip.attr('data-original-title', App.mp[mp]+" Slot price for Partners in your Network at the Level.");
				    priceTooltip.css('cursor','pointer');
				    priceTooltip.attr('data-placement',"bottom").tooltip();
				    
				    reopensTooltip.attr('data-original-title', "Number of reopens "+App.mp[mp]+" Pools at the Level.");
				    reopensTooltip.css('cursor','pointer');
				    reopensTooltip.attr('data-placement',"bottom").tooltip();

			    	if (i == mpMaxLevel-1){
			    					
			    		if (slotNumber > 6) {

			    			levelCard.find(selector+" #levelWarning").show();
			    			let warningSpan =	levelCard.find(selector +" #name");
				    		/*
				    		slotsTooltip.attr('data-original-title', "");
				    		reopensTooltip.attr('data-original-title', "");
				    		*/
				    		priceTooltip.attr('data-original-title', "");

				    		if (slotNumber == 10) {
				    			
				    			warningSpan.removeClass('text-white').addClass('text-danger')
				    			warningSpan.attr('data-original-title', App.mp[mp]+" slots of Level "+levelNumber+" are exhausted. Level Up to pr_event loss of profit.");
				    			warningSpan.css('cursor','pointer');
				    			warningSpan.attr('data-placement',"bottom").tooltip();

				    		} else {

				    			warningSpan.removeClass('text-white').addClass('text-warning');
				    			warningSpan.attr('data-original-title', App.mp[mp]+" slots of Level "+levelNumber+" are running out. Level Up to pr_event loss of profit.");
				    			warningSpan.css('cursor','pointer');
				    			warningSpan.attr('data-placement',"bottom").tooltip();
				    		}
				    	}

			    	}	    		
		    	}

		    	levelCard.find("#poolLevel")[0].innerHTML=levelNumber;
		    	levelCard.find("#basic .bx-user").each(function(k){ 

		    		if (k<(App.level[0][i]-1)%3){

		    			$(this).addClass('text-white-1');
		    		}
		    		else if ($(this).hasClass('text-white-1')) {

		    			$(this).removeClass('text-white-1');

		    		}

		    	});


		    	// Check th Fast marketing paln activation
		    	if (App.level.length > 1) {

		    		//The Fast marketing plan is active
		    		
		    		// Check the slots of the Fast marketing plan at the level
			    	if (i < App.level[1].length){

			    		//The level has slots

			    		levelCard.find("#fast").addClass("d-flex");

						  levelCard.find("#fast .bx-user").each(function(k){ 

				    		if (k<(App.level[1][i]-1)%3){

				    			$(this).addClass('text-info');
				    		}
				    		else if ($(this).hasClass('text-info')) {

				    			$(this).removeClass('text-info')

				    		}

				    	})
				    	

				    	levelCard.find("#buttonFast").removeClass("d-flex");
						  levelCard.find("#buttonFast").hide();

			    		levelCard.find("#fast #slots")[0].innerHTML=App.level[1][i]-1;
			    		levelCard.find("#fast #reloads")[0].innerHTML=(App.level[1][i]-1 - (App.level[1][i]-1)%3)/3;

						} else if (i > App.level[1].length){

			    		levelCard.find("#buttonFast").removeClass("d-flex");
						  levelCard.find("#buttonFast").hide();
			    	}
		    	}	else if (i>0) {

			    	levelCard.find("#buttonFast").removeClass("d-flex");
						levelCard.find("#buttonFast").hide();	    		
		    	}

		    	// Check the VIP marketing plan activation
		    	if (App.level.length>2) {

			    	//The VIP marketing plan is active

			    	// Check the slots of the VIP marketing plan at the level
			    	if (i < App.level[2].length){

			    		levelCard.find("#vip").addClass("d-flex");

						  levelCard.find("#vip .bx-user").each(function(k){ 

				    		if (k<(App.level[2][i]-1)%3){

				    			$(this).addClass('text-warning');
				    		}
				    		else if ($(this).hasClass('text-warning')) {

				    			$(this).removeClass('text-warning')

				    		}

				    	});


				    	levelCard.find("#buttonVip").removeClass("d-flex");
						  levelCard.find("#buttonVip").hide();

			    		levelCard.find("#vip #slots")[0].innerHTML=App.level[2][i]-1;
			    		levelCard.find("#vip #reloads")[0].innerHTML=(App.level[2][i]-1 - (App.level[2][i]-1)%3)/3;

						} else if (i > App.level[2].length){

			    		levelCard.find("#buttonVip").removeClass("d-flex");
						  levelCard.find("#buttonVip").hide();
			    	}
		    	} else if (i > 0) {

			    	levelCard.find("#buttonVip").removeClass("d-flex");
						levelCard.find("#buttonVip").hide();	    		
		    	}

		    	levelCard.find("#basic #slots")[0].innerHTML=App.level[0][i]-1;
		    	levelCard.find("#basic #reloads")[0].innerHTML=(App.level[0][i]-1 - (App.level[0][i]-1)%3)/3;
		    	levelCard.show();
		    	
		    	row.append(levelCard);
		    	if (i%4 == 3) {
		    		pools.append(row);
		    		row = $('<div class="row"></div>');;
		    	}

		    }

		    //nextLevelCard.find("#buttonUnderline")[0].innerHTML="Level Up";
		    nextLevelCard.find("#poolLevel")[0].innerHTML=App.level[0].length+1;
				

	    	$("#referrals")[0].innerHTML = App.referrals.length;
	    	if (App.referralsPlus >0){
	    		$("#referralsPlus").show();
	    		$("#referralsPlus")[0].innerHTML ='+' + App.referralsPlus;
	    	} else {
	    		$("#referralsPlus").hide();
	    	}

	    	$("#network")[0].innerHTML = App.network;
	    	if (App.networkPlus >0){
	    		$("#networkPlus").show();
	    		$("#networkPlus")[0].innerHTML ='+' + App.networkPlus;
	    	} else {
	    		$("#networkPlus").hide();
	    	}

	     	//nextLevelCard.find(".nextLevelPrice").each(function(k){this.innerHTML =  App.nextLevelPrice[k];});
	     	if (App.level.length > 1 && App.level[0].length == App.level[1].length) {
	     		nextLevelCard.find("#buttonFast").addClass("d-flex");
	     		if(App.level.length > 2 && App.level[1].length == App.level[2].length) {
	     			nextLevelCard.find("#buttonVip").addClass("d-flex");
	     		} else {
	     			nextLevelCard.find("#buttonVip").removeClass("d-flex");
	     		}
	     	} else {
	     		nextLevelCard.find("#buttonFast").removeClass("d-flex");
	     		nextLevelCard.find("#buttonVip").removeClass("d-flex");
	     	}

	     	row.append(nextLevelCard);
		  	pools.append(row);

			  // Remove bottom border from the last visible li element in the each level card
			  pools.find(".levelCard").each(function(){$(this).find("ul.list-group > li:visible").last().css("border-bottom-width","0").addClass("pb-0");});

			  // Remove bottom border from the last li element in the next level card
			  nextLevelCard.find("ul.list-group > li:visible").last().css("border-bottom-width","0").addClass("pb-0");

			  App.renderPrices();
	  	} else {

	  		App.showRegistration(true);
	  	}
	  	App.setModals();
	  	$('[data-toggle="tooltip"]').tooltip();    	
    }
  },

  // Set a page to the defaul state
  setDefaults: function (){
  	// Set coin 
  	$(".crypto").each(function(){this.innerHTML = App.crypto});

  	// Set names of the marketing plans 
  	$(".mp0").each(function(){this.innerHTML = App.mp[0]});
  	$(".mp1").each(function(){this.innerHTML = App.mp[1]});
  	$(".mp2").each(function(){this.innerHTML = App.mp[2]});

  	// Show exchange rates of the current project coin
  	App.initExchangeRates();

  	// Set a next level card varible
	  var nextLevelCard = $("#nextLevelCard");

	  // Set a Basic button text of the next level card
	 	// nextLevelCard.find("#buttonUnderline")[0].innerHTML="Registration";

	  // Set a level of the next level card
	  nextLevelCard.find("#poolLevel")[0].innerHTML=1;

	  // Set a text of a not registered partner's bage
  	$("#userId")[0].innerHTML = '<span class="badge badge-danger">Wallet not registered</span>';
  	
  	// Set a default current level of the Basic marketing plan
  	$("#level")[0].innerHTML = '0';

  	// Hide Fast and VIP marketing plans current levels
  	$("#levelFast").hide();
  	$("#levelVip").hide();

  	// Set an total income amount 
  	$("#income")[0].innerHTML ='0.00';

  	// Hide an income plus bage
  	$("#incomePlus").hide();
  	$("#incomeCrypto")[0].innerHTML ='0.00';
  	$("#incomeCryptoPlus").hide();
  	$("#referrals")[0].innerHTML ='0';
  	$("#referralsPlus").hide();
		$("#network")[0].innerHTML = '0';
		$("#networkPlus").hide();
		$("#directIncome")[0].innerHTML = '0.0000';
		$("#directIncomePlus").hide();
		$("#networkIncome")[0].innerHTML = '0.0000';
		$("#networkIncomePlus").hide();
		$("#lostProfit")[0].innerHTML = '0.0000';
		$("#lostProfitPlus").hide();
	  nextLevelCard.find("#buttonFast").removeClass("d-flex");
	  nextLevelCard.find("#buttonFast").hide();
	  nextLevelCard.find("#buttonVip").removeClass("d-flex");
	  nextLevelCard.find("#buttonVip").hide();
		var levelCard = $("#levelCard");
	  levelCard.find("#fast").removeClass("d-flex");
	  levelCard.find("#fast").hide();
	  levelCard.find("#vip").removeClass("d-flex");
	  levelCard.find("#vip").hide();
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
		$('.modal-body').each(function(){
			new PerfectScrollbar(this);
		});	
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
		//$('[data-toggle="tooltip"]').tooltip()
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
