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

	showError: function(show, title, text){

		if (show) {
			$("#error").addClass('d-flex');
			$("#error").show();
			$("#error h1")[0].innerHTML = title;
			$("#error p")[0].innerHTML = text;
			$(".nav-container").hide();
			$(".page-wrapper").hide();
			$("#userIdContainer").hide();
			App.renderExchangeRates()

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
		try {	

			request.open('GET', requestURL);
			request.responseType = 'json';
	

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
			return App.initWeb3();

		}
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
					// the Wallet is locked or the user has not connected any accounts
					console.log('Please connect to the Wallet.');

					App.showError(true, 'the Wallet is Dissconnected', 'Plese connect to the Wallet and choose '+App.chainName+'.');

				} else if (accounts[0] !==  App.account) {
				  App.account = accounts[0];
				}
					  		 
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
		  	App.showError(true, 'Login to the Wallet', "Please Login and allow the Criptolife access to it. ")

		    // Request account access

		    let accounts = await ethereum.request({ method: 'eth_accounts' });
		    App.account = accounts[0];

		  } catch (error) {
		    // User denied account access...
		    console.warn("User denied account access");

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
	  		App.showError(true, 'Chain connection problem...', 'Plese check if the Wallet connected to '+App.chainName+'.');
	  		return App.render();

		  }

		  if (App.chainId !== App.mainChainId){

	  		App.showError(true, 'Connected to the wrong chain', 'Plese please connect to '+App.chainName+' in the Wallet.');
	  		return App.render();

		  }


		}
		// Legacy dapp browsers...
		else if (window.web3) {
		  App.web3Provider = window.web3.currentProvider;
		  
		  let temp = await web3.eth.getAccounts();
			App.account = temp[0];

		}
		// If no injected web3 instance is detected, fall back to Ganache
		else {
		  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		  App.showError(true, 'No wallet detected', "Please install the Wallet and connect to it. ")
		}
		web3 = new Web3(App.web3Provider);

		

		web3.eth.getBlockNumber(function(err, result){ 

			App.currentBlock = result;

			console.log('--- Web3 initiated ---');
			
			return App.initContract();

		});    
  },

  initContract: function() {


	    $.getJSON("../contracts/CryptoLife.json", function (data) {

	      // Instance a new truffle contract from the artifact
	      App.contracts.CryptoLife = TruffleContract(data);
	      
	      //Connect provider to interact with contract
	      App.contracts.CryptoLife.setProvider(App.web3Provider);

	      App.setDefaults();

	      console.log('--- Contract initiated ---');
	      return App.initAccount();

	    });  
  },

  initAccount: async function(){


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
			App.networkStart = temp;
			console.log( "network: " + App.networkStart);
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
  		App.showError(true, 'Contract not found...', 'Plese check if the Wallet connected to '+App.chainName+'.');
  		return App.render();
  	});
	},

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

	loadContractData: async function(init) {

		if (await App.checkRegistration()){

			await App.loadPartnerData();
			
			App.readPastEvents();

	 		console.log('--- Contract Data loaded ---');

			return App.render();

 		} else {

			window.location.assign('account.html'+window.location.search);
		}
	}, 

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
				App.network = partner[7];
				   			
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


 	// Current currency change function
  changheCurrentCurrency: function (currency){

    	$('#currentExchangeRate')[0].innerHTML= App.exchange[currency].toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
      $('.current-currency').each(function(){$(this).attr('class', App.currencyIconClass[currency] + " current-currency");});
      App.currentRate = App.exchange[currency];
      App.currentCurrency = currency;
  },

  // Render an Exchanre rates list in the header section
  renderExchangeRates: function (){

  	$("#USD span")[0].innerHTML = App.exchange.USD.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		$("#EUR span")[0].innerHTML = App.exchange.EUR.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');		
		$("#ILS span")[0].innerHTML = App.exchange.ILS.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		$("#GBP span")[0].innerHTML = App.exchange.GBP.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		$("#JPY span")[0].innerHTML = App.exchange.JPY.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		$("#WAN span")[0].innerHTML = App.exchange.WAN.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		$("#RUB span")[0].innerHTML = App.exchange.RUB.toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');

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

  		// Show only fixed number of notifications
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

  renderStructure: async function() {

  	let network = $("#structure");
  	network.empty();
  	$(".spinner-border").show();

  	async function getReferralsArray(_sponsor){

  		let referralsArray = [];

	  	if (_sponsor != 0){

	  		if (_sponsor[6].length > 0) {

		  		for (let i = 0; i< _sponsor[6].length; i++){

			  		let referral = await App.cryptoLife.getMyData({from:_sponsor[6][i]}).catch(function(error) {
			 
						  console.warn(error);
						      
						});
			  		let referralType = 'middle';

			  		if (_sponsor[6].length == 1) {

			  			referralType = 'single'
			  		} else {
			  			if (i == 0){
								referralType = 'first';
							}
							if (i == _sponsor[6].length-1) {
								referralType = 'last';
							}
						}

			  		referralsArray.push({data: referral, referralType: referralType});

		  		}
	  		} else {

	  			referralsArray.push(0);
	  		}
  		} else {

  			referralsArray.push(0);
  		}


  		return referralsArray;
  	}

  	async function renderReferralRow(_sponsor, _rowId){

  		let referralCard = App.referralCard.clone(true);

  		referralCard.find("#refId")[0].innerHTML = _sponsor[0];
  		referralCard.find("#mp0Level")[0].innerHTML = _sponsor[1].length;
  		referralCard.find("#mp1Level")[0].innerHTML = _sponsor[2].length;
  		referralCard.find("#mp2Level")[0].innerHTML = _sponsor[3].length; 
  		referralCard.find("#referrals")[0].innerHTML = _sponsor[6].length;
  		referralCard.find("#network")[0].innerHTML = _sponsor[7]; 

  		if (_sponsor[3].length >0){
		  	referralCard.find("#userAvatar").addClass("text-warning");
		  } else if (_sponsor[2].length >0){
		  	referralCard.find("#userAvatar").addClass("text-info");
		  } 		

  		// Matrix of a sponsor's refarals to render
  		let referralRow = [];



  		if (_sponsor[6].length>0){

	  		referralRow[0] = [];

	  		// Maximum depth of the sonsor's network
	  		let maxDepth = 1;

	  		// Fill a first column 
	  		referralRow[0] = referralRow[0].concat(await getReferralsArray(_sponsor));

	   		// Fill in the matrix until depth 6 is reached 
	  		while (!isEmpty(referralRow[maxDepth-1]) && maxDepth<5){

	  			referralRow[maxDepth] = [];

		  		for (let k = 0; k < referralRow[maxDepth-1].length; k++){

		  			let temp = 0;

		  			if (referralRow[maxDepth-1][k] != 0) {

		  				temp = referralRow[maxDepth-1][k].data;

		  			}

		  			referralRow[maxDepth] = referralRow[maxDepth].concat(await getReferralsArray(temp));
		  		}  				

	  			maxDepth++;
	  		}

	  		if (isEmpty(referralRow[maxDepth-1])) {
	  			referralRow.pop();
	  		} 		

	  		for (let i = maxDepth-2; i >-1; i--){
	  			for (let k = 0; k < referralRow[i].length; k++){
	  				if (referralRow[i][k].data != undefined){

	  					if (referralRow[i][k].data[6].length>1){
	  						addFillers(referralRow[i][k].data[6].length-1, i, k);
	  					}  					
	  				}
	  			}
	  		}

  		}






			referralCard.attr("id", referralCard.attr("id") + _rowId);

  		for (let i = 0; i< referralRow.length; i++ ){

  			let depth = App.depth.clone(true);

  			depth.find("#title")[0].innerHTML = "Depth "+(i+2);

  			for (let k = 0; k < referralRow[i].length; k++){

  				let obj = getReferralCard(referralRow[i][k]); 

  				depth.append(obj);
				
  			}

  			referralCard.append(depth);
 					
  		}


  		referralCard.append(App.spacer.clone(true));

  		network.append(referralCard);


	  	function addFillers(_count, _depth, _rowAfter){

	  		for (let i = _depth; i>-1; i--){
	  			if (_rowAfter < referralRow[i].length) {

	  				referralRow[i] = referralRow[i].slice(0,_rowAfter+1).concat(new Array(_count).fill(1)).concat(referralRow[i].slice(_rowAfter+1));
	  			} else {

	  				referralRow[i] = referralRow[i].concat(new Array(_count+_rowAfter-referralRow[i].length).fill(0));
	  			}
	  			
	  		}
	  	}

	  	function isEmpty (_col){

	  		let empty = true;
	  		for (let i=0; i< _col.length; i++){
	  			if (_col[i] !=0) {
	  				empty = false;
	  				break;
	  			}
	  		}
	  		return empty;

	  	}

	  	// Tooltips 

			console.log($('[data-toggle="tooltip"]').tooltip());
  	}

  	function getReferralCard(_referral){


  		let referralCard;	
  		switch (_referral ) {

  			case 0:
  			  referralCard = App.filler.clone(true);
  			  referralCard.find(".col").each(function(){$(this).removeClass("border-right");});
  			break;
  			case 1: 
  				referralCard = App.filler.clone(true);

  			break;
  			default:
  				referralCard = App.networkCard.clone(true);
		  		referralCard.find("#refId")[0].innerHTML = _referral.data[0];
		  		referralCard.find("#mp0Level")[0].innerHTML = _referral.data[1].length;
		  		referralCard.find("#mp1Level")[0].innerHTML = _referral.data[2].length;
		  		referralCard.find("#mp2Level")[0].innerHTML = _referral.data[3].length; 
		  		referralCard.find("#referrals")[0].innerHTML = _referral.data[6].length;
		  		referralCard.find("#network")[0].innerHTML = _referral.data[7];

		  		switch (_referral.referralType){

		  			case 'middle':
		  				referralCard.find("#topLine .col").addClass("border-right");
		  			break;
		  			case 'last':
		  				referralCard.find("#topLine .col").addClass("border-right");
		  				referralCard.find("#bottomLine .col").removeClass("border-right");
		  			break;
		  			case 'single':
		  				referralCard.find("#bottomLine .col").removeClass("border-right");
		  			break;
		  		}

		  		if (_referral.data[3].length >0){
		  			referralCard.find("#userAvatar").addClass("text-warning");
		  		} else if (_referral.data[2].length >0){
		  			referralCard.find("#userAvatar").addClass("text-info");
		  		}
  			break; 
  		}

  		return referralCard;
  	}

  	if (App.referrals.length > 0){
	  	for(let i=0; i<App.referrals.length; i++){

	  		
	  		let referral = await App.cryptoLife.getMyData({from:App.referrals[i]}).catch(function(error) {

				  console.warn(error);
				      
				});


	  		await renderReferralRow(referral, i);
	  	}
		} else {
			network.append('<h6>No Referrals yet.</h6>')
		}

  	$(".spinner-border").hide();

  },

  
  render: function() {

		
  	$('#balance')[0].innerHTML = (App.balance/10**18).toFixed(6);
  	$('#cryptoLogo').attr("src","img/"+App.crypto+".svg");
  	App.renderExchangeRates();

  	if (App.account.length > 12) {
  		$("#userAccount")[0].innerHTML = App.account.substr(0,12)+'...'+App.account.substr(App.account.length-10);
  	}
    
    $("#userAccountBage").removeClass("badge-danger").addClass("badge-success");
    $("#userAccountBage")[0].innerHTML = "Online";

  	if ( App.partnerId >0) {

  		$("#userId")[0].innerHTML = App.partnerId;
  		App.renderStructure();

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
  	App.renderExchangeRates();
 
  	// Hide error part of the page
  	App.showError(false);

    // Set a text of a not registered partner's bage
  	$("#userId")[0].innerHTML = '<span class="badge badge-danger">Wallet not registered</span>';
  	
		if ($("#messege")){
			App.messageHeight =$(".header-notifications-list").height();
			App.messegeEtalon = $("#messege").detach();
		}

		if ($("#filler")){
			App.filler = $("#filler").detach();
			
		}
		if ($("#networkCard")){
			App.networkCard = $("#networkCard").detach();
		}		

		if ($("#depth")){
			App.depth = $("#depth").detach();
		}	
		if ($("#spacer")){
			App.spacer = $("#spacer").detach();
		}	

		if ($("#referralCard")){
			App.referralCard = $("#referralCard").detach();
		}	

		let temp = $(window).height()-$("#structure").offset().top-$("#footer").height()-parseInt($("#footer").css("padding-bottom").replace("px","")) -  parseInt($("#footer").css("padding-top").replace("px",""));
		$("#structure").css("min-height", temp);			

		window.onresize = function(event){

			let temp = $(window).height()-$("#structure").offset().top-$("#footer").height()-parseInt($("#footer").css("padding-bottom").replace("px","")) -  parseInt($("#footer").css("padding-top").replace("px",""));
			$("#structure").css("min-height", temp);
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