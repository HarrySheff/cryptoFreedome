App = {
  web3Provider: null,
  contracts: {},
  account: '0x0000000000000000000000000000000000000000',
  crypto: "BNB",
  chainId: 0,
  chainName: 'Smart Chain - Testnet',
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

	basicIncomeBalance: 0,
	basicIncomeSumm: 0,
	basicIncomeResult: 0,
	topDelta: 0,
	basicIncomeMinimumLevel: 0,	
	sponsorId: 1,
	mp:['Light', 'Smart', 'Prime'],
	registrationPrices: [],
	showNotificationsCount: 15,
	pricesUpdateInterval: 120,
	currentTimeToPricesUpdate: 120,
	roundId: 0,
	hasError: false,
	events:[],
	eventsSet: new Set(),
	rateCorrection: 0.001,
	lastSeenBlockNumber: 0,
	langs: {'en':{'name':'En', 'flag':'flag-icon flag-icon-um'}, 'ru':{'name':'Ру', 'flag':'flag-icon flag-icon-ru'}}, // It's inportant to use lower case
	mode: 'test',
	providerAddress: 'https://data-seed-prebsc-2-s1.binance.org:8545',
	explorerUrl: 'https://testnet.bscscan.com',
	contractAddress: '0xC4C8DAfFb937638009eBCcc1E3122cE658D8f45f',
	cryptoDecimasNumber: 5,
	maxLevel: 16,

	// An Error section show and hide function
	showError: function(show, title, text){

		// Check action type
		if (show) {

			// Show th error section

			// Restore css class d-flex to show the section
			$("#error").addClass('d-flex');

			// Show error secction
			$("#error").show();

			// Set the section title
			$("#error h1")[0].innerHTML = title;

			// Set the section description text
			$("#error p")[0].innerHTML = text;

			// Hide a navigation panel
			$(".nav-container").hide();

			// Hide a page content
			$(".page-wrapper").hide();

			// Hide a partner info section
  		$("#userIdContainer").hide();

  		// Hide an account info section
  		$("#accountData").hide();

  		// Hide a notification section
  		$("#messageContainer").hide();			

  		// Hide an open menu button near the logo
			$(".sidebar-header > a").hide();

		} else {

			//Hide the error section

			// Remove css class d-flex to allow hide the section
			$("#error").removeClass('d-flex');
			
			// hide the error section
			$("#error").hide();

			// Show the navigation panel
			$(".nav-container").show();

			// Show the page content
			$(".page-wrapper").show();

			// Shoe the partner info section
			$("#userIdContainer").show();

			// Show the open menu button
			$(".sidebar-header > a").show();

			// Show the account section
  		$("#accountData").show();

  		// Show the notification section
  		$("#messageContainer").show();			
		}

	},

	// Get value from cookies
	getValueFromCookies(_value, _prefix, _notNumber){

		// Set cookies sthring
		var cookiesValue = "; " + document.cookie;

		// Split cookies string on parts with and without varible name
		var parts = cookiesValue.split("; " + _prefix+'_' +_value + "=");

		// Check parts number
		// Second part should starts from value of varible 
		// If exist second part use a value from start to splitter ";"
		if (parts.length == 2) {
			
			// Second part exist 

			// Get cookie value
			let temp = parts.pop().split(";").shift();

			// Number check
			if (_notNumber){

				// Value is not number

				// Log the cookie value
				console.log( _value+": " + temp);

				// Return the cookie value
				return temp;				
			} else

			// Convert the cookie value to number from string
			temp = parseInt(temp,10);

			// Check for null and zero
			if (temp != null && temp >0) {
				
				// Log the cookie value
				console.log( _value+": " + temp);

				// Return the cookie value
				return temp;
			} else return 0;
		} else return 0;

	},

	// An app initiaion
  init:  async function() {

  	// Show the app initiation text instead of the content
  	App.showError(true, l100n.localize_string("err-load-h"), l100n.localize_string("err-load-p"));

		// Get language from the cookies 
		let temp = App.getValueFromCookies('lang', 'cryptolife', true);
			
		// Check for null and zero values
		if (temp!= null && temp !=0) {
			App.changeLang(temp);  	
		} else {
			App.changeLang("en");
		}
  	// Set the content default values
  	App.setDefaults();

  	// Log the step finish text
		console.log('--- App initiated ---');

		// Go to the next step
		return App.initWeb3();
  },

  // Web3 initiation
  initWeb3: async function() {
    
    // Modern dapp browsers check
		if (window.ethereum) {

			// Set an web3 proveder
		  App.web3Provider = window.ethereum;

		  // Define the account change actions
			window.ethereum.on('accountsChanged', (accounts) => {

				// Handle the new accounts, or lack thereof.
				// "accounts" will always be an array, but it can be empty.
				if (accounts.length === 0) {

					// The Wallet is locked or the user has not connected any accounts

					// Mark the page as has an error
					App.hasError = true;

					// Show the error text istead of the content
					App.showError(true, l100n.localize_string("err-wallet-h"), l100n.localize_string("err-wallet-p")+App.chainName+'.');

					// Log an error
					console.log('Please connect to the Wallet.');

					// Check if the account is changed
				} else if (accounts[0] !==  App.account) {

					// The acoount is changed

					// Set a new account
				  App.account = accounts[0];
				}
				
				// Reload the page
				window.location.reload();
			});

			// Define the chain change action
			window.ethereum.on('chainChanged', (chainId) => {

				// Reload the page
			  window.location.reload();
			});

			// Try to get an account from the wallet
		  try {

		  	// Log the step start
		  	console.log('--- Try request an account ---');

		  	// Show the login text istead of the page content
		  	App.showError(true, l100n.localize_string("err-login-h"), l100n.localize_string("err-login-p"))

		    // Request account access
		    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		    
		    // Check the acounts array
		    if (accounts && accounts.length > 0){

		    	// The accounts array is setted and not empty

		    	// Set the account as first in the acounts array
		    	App.account = accounts[0];
		    } else {

		    	// The accounts array is not setted

		    	// Mark the page as has an error
		    	App.hasError = true;

		    	// Shoe the error text instead of the page content
			    App.showError(true, l100n.localize_string("err-access-h"), l100n.localize_string("err-access-p"));

			    // Render the page
			    return App.render();
		    }

		  } catch (error) {

		    // User denied account access

		    // Mark the page has an error
		    App.hasError = true;

		    // Show the error text instead of the content
		    App.showError(true, l100n.localize_string("err-access-h"), l100n.localize_string("err-access-p"));

		    // Log the error
		    console.warn("User denied account access");

		    // Render the page
		    return App.render();
		  }

		  // Try to get chain ID
		  try {

		  	// Set the chain ID from the wallet
		  	App.chainId = await ethereum.request({ method: 'eth_chainId' });

		  } catch (error){

		  	// Somthing wrong

		  	// Show the error popup
				Lobibox.notify('warning', {
					pauseDelayOnHover: true, 
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: error.message
				});

				// Log the error		
	  		console.warn(error);

	  		// Mark the page as has an error
	  		App.hasError = true;

	  		// Show he error text instead of the content
	  		App.showError(true, l100n.localize_string("err-chprob-h"), l100n.localize_string("err-chprob-p"));

	  		// Rnder the page
	  		return App.render();

		  }

		  // Check the chain ID
		  if (App.chainId !== App.mainChainId){

		  	// Connected to the wrong chain
		  	
	  		if (ethereum.isMetaMask){

	  			App.hasError = true;
	  			App.showError(true, l100n.localize_string("err-wrongM-h"), l100n.localize_string("err-wrongM-p1")+App.chainName+l100n.localize_string("err-wrongM-p2"));
	  			$('#chainSwithcLink').off('click').on('click', async function(){

	  				await ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:App.mainChainId}]})
	  				.catch(function(_error){

	  					// Have an error

				  		// Pop up the error
							Lobibox.notify('warning', {
								pauseDelayOnHover: true,
								icon: 'bx bx-error',
								continueDelayOnInactiveTab: false,
								rounded: true,
								position: 'top center',
								msg: _error.message
							});	
	  				});

	  			});

	  		} else {

	  			App.hasError = true;
	  			App.showError(true,  l100n.localize_string("err-wrong-h"), l100n.localize_string("err-wrong-p1")+App.chainName+l100n.localize_string("err-wrong-p2"));
	  		}

	  		// Rnder the page
	  		return App.render();

		  }
		}

		// Legacy dapp browsers check
		else if (window.web3) {

			// Legacy browser detected

			// Set an web3 proveder
		  App.web3Provider = window.web3.currentProvider;
		  
		  // Get the acoounts array
		  let accounts = await web3.eth.getAccounts();

		  // Check the acounts array
		  if (accounts && accounts.length > 0){

		    // The accounts array is setted and not empty

		    // Set the account as first in the acounts array
		    App.account = accounts[0].toLowerCase();
		  } else {

		    // The accounts array is not setted

		    // Mark the page as has an error
		    App.hasError = true;

		    // Show the error text instead of the page content
			  App.showError(true, l100n.localize_string("err-access-h"), l100n.localize_string("err-access-p"));

			  // Render the page
			  return App.render();
		  }			

		}	else {

			// If no injected web3 instance is detected, connect to the testnet

			// Set the web3 proveder
		  App.web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');

		  // Show the error text instead of the page content
		  App.showError(true, l100n.localize_string("err-nowallet-h"), l100n.localize_string("err-nowallet-p"));

		  // Mark the page as has an error
		  App.hasError = true;

		  // Render the page
		  return App.render();
		}

		// Reinitiate web3 with new provider
		web3 = new Web3(App.web3Provider);		

		// Get a current block number in the chain
		web3.eth.getBlockNumber(function(err, result){ 

			// Set the current block number in the chain	
			App.currentBlock = result;

			// Log the step finish text
			console.log('--- Web3 initiated ---');
			
			// Go to the next step
			return App.initContract();

		});    
  },

 	// Initiate a Сontract
  initContract: function() {

  	// Show an initiatig contract text instead of the page content
  	App.showError(true, l100n.localize_string("err-init-h"), l100n.localize_string("err-init-p"));

  	// Get the smart contract data
	  $.getJSON("../contracts/CryptoLife.json", function (data) {

	    // Instance a new truffle contract from the artifact
	    App.contracts.CryptoLife = TruffleContract(data);
	      
	    //Connect provider to interact with contract
	    App.contracts.CryptoLife.setProvider(App.web3Provider);

	    // Log the step finish text
	    console.log('--- Contract initiated ---');

	    // Go to the next step
	    return App.initAccount();

	  });   
  },

  // A Current Address data load from cookies and wallet
  initAccount: async function(){

		// Get a sponsor ID from the page address link
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

		//Looking for the sponsor ID

		// Get the sponsor ID from the link 
		temp = getRefiralFromLink();

		// Check the sponsor ID value
		if (temp != null && temp >0) {

			// The value is not null

			// Set the sponsor ID value
			App.sponsorId = temp;

			// Log the sponsor ID value
			console.log( "sponsor ID: " + App.sponsorId);

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Save the sponsor ID in the cookies 
			document.cookie = 'cryptolife_ref='+temp+'; path=/; expires=' + date;

		} else {

			// The sponsor ID value is null

			// Get the sponsor ID from the cookies 
			App.sponsorId = App.getValueFromCookies('ref', 'cryptolife', true);
		}


		// Check the account value
		if (App.account == undefined){

			// The account is undefined

			// Set an zero wallet value
			App.account = '0x0000000000000000000000000000000000000000';

			// Log an account receive error
		  console.log('No account receive from Wallet');

		  // Mark the page as has an error
		  App.hasError = true;

		  // Show an error message instead of the content
		  App.showError(true, l100n.localize_string("err-acc-h"), l100n.localize_string("err-acc-p"));

		  // Render the page
		  return App.render();
		} else {

			// The account value is setted

			// Open a socket

			App.socket = io(window.location.host,{autoConnect: false});

			App.socket.auth = {account: App.account};

			App.socket.on('setAccountData',(response)=>{

				// Get network number 
				App.networkStart = response?response.network:0;

				// Get referrals
				App.referralsLenght = response?response.referrals:0;

				// Get last seen block
				App.lastSeenBlock = response?response.lastSeenBlock:0;

		  	// Largest seen block number
		  	App.lastSeenBlockNumber = App.lastSeenBlock;

				// Get direct income 
				App.directIncome = response?response.directIncome:0;

				// Get network income 
				App.networkIncome = response?response.networkIncome:0;

				// Get missing income 
				App.lostProfit = response?response.lostProfit:0;

				// Get events 
				App.events = response?response.events:[];

				// Get chats
				App.chats = response?response.chats:[];

			});

			App.socket.connect();

			// Get current currency
			let temp = App.getValueFromCookies('currentCurrency', App.account, true);

			// Check for null and zero values
			if (temp != null && temp !=0)	App.currentCurrency = temp;

			// Get the account balance
			App.getBalance();


			// Log step finish message
			console.log('--- Account initiated ---');	
		}

  	return App.deployContract();
  },

  // Get the account balance
  getBalance: function(){

  	// Check the account
  	if (App.account != undefined && App.account != '0x0000000000000000000000000000000000000000'){

  		// The account has a value

  		// Get an account balance
	 		web3.eth.getBalance(App.account, web3.eth.defaultBlock, function(err, balance){
		    
		    // Check for errors    	
		  	if (err != null) {

		  		// Have an error

		  		// Pop up the error
					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: err.message
					});	

					// Log the error	  		
		    	console.log(err);

		  	} else {

		  		// No errors

		  		// Set the balance
		    	App.balance = balance;
		  	}
			});
	 	}
  },

  // The Contract deployment  
  deployContract: async function() {
  	
    // Get deployed contract

    // Deploy the contract
    App.contracts.CryptoLife.deployed().then(function(instance){

    	// Set a contract instance
   		App.cryptoLife = instance;

   		// Log the step finished text
   		console.log('--- Contract deployed ---');

   		// Go to the next step
   		return App.loadContractData();
    })

    // Catch the errors
    .catch(function(error){

    	// Pop up the error
			Lobibox.notify('warning', {
				pauseDelayOnHover: true,
				icon: 'bx bx-error',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: error.message
			});

			// Log the error
  		console.warn(error);

  		// Mark the page as has an error
  		App.hasError = true;

  		// Show an error message instead of the content
  		App.showError(true, l100n.localize_string("err-nofound-h"), l100n.localize_string("err-chprob-p")+App.chainName+'.');

  		// Render the page
  		return App.render();
  	});
	},

	// Registration check the Сurrent address in the Сontract
	checkRegistration: async function(){

		// Get and set a registration status from the contract
		let isRegistered = await	App.cryptoLife.isRegistered({from:App.account})

		// Chatch the errors
		.catch(function(error) {

			// Pop up the error
			Lobibox.notify('warning', {
				pauseDelayOnHover: true,
				icon: 'bx bx-error',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: error.message
			});
		  
		  // Log the error
		  console.warn(error);

		  // Return false
		  return false;
		      
		});

		// Return the result
		return isRegistered;			
	},

	// Check the registration of the Сurrent address and load the corresponding data
	loadContractData: async function(init) {

		// Check current account for the registration
		if (await App.checkRegistration()){

			// The account is registered

			// Load data of the partner
			await App.loadPartnerData();

 		} else {

			// The account is not registered

			// Redirect to the marketing palans page
			window.location.assign('marketing.html');
		}

		// Load a Basic Income data
		await App.loadBasicIncomeData();

		// Load a registration prices
		await App.loadRegistrationPrices();

		// Start timer for a prices update
		App.startPricesTimer();

		// Log the step finish 
 		console.log('--- Contract Data loaded ---');

 		App.render();

 		// Start reading events from the chain
		return App.readPastEvents();
	}, 

	// Load a Top Leader data and bonus progress from the Contract
	loadBasicIncomeData: async function() {

		// Get the Basic Income data from the contract
		let top = await App.cryptoLife.getbasicIncomeData()

		// Chatch the errors
		.catch(function(error){

			// Pop up the error
			Lobibox.notify('warning', {
				pauseDelayOnHover: true,
				icon: 'bx bx-error',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: error.message
			});

			// Log an error
			console.warn(error);

		});

		// Check received data
		if (top !=null){

			//The data is not null

			// Set contract balance
			App.basicIncomeBalance = top[0];

			// Set summ of the Basic Income
			App.basicIncomeSumm = top[1];

			// Set requiered summ to next payment
      App.basicIncomeResult = top[2];


			// Set required active marketing plan
			App.basicIncomeMp = top[3];	

			// Set minimum required level 
			App.basicIncomeMinimumLevel = top[4];	
		}		    		
  },

  // Load Partner's data from the Contract
  loadPartnerData: async function (toRender) {

		// Get data from the contract
		let partner = await	App.cryptoLife.getMyData({from:App.account})

		// Catch the errors
		.catch(function(error) {

				// Pop up the error
				Lobibox.notify('warning', {
					pauseDelayOnHover: true,
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: error.message
				});

				// Log an error
				console.warn(error);

				// Check for page render need
			  if(toRender) { 

			  	// Page render needs

			  	// Render the page
			  	return App.render();
			  }
			      
		});

			// Check a data of the partner
			if (partner != null && partner[0]>0){

				// Data is not null and partner ID above zero

				//Cookie expiration date
				let date = new Date;

				//Add one year
				date.setDate(date.getDate() + 360); 

				//Convert to UTC format
				date = date.toUTCString();
				
				// Set the partner ID
				App.partnerId = partner[0];

				// Clear the marketing plan levels array
				App.level = [];

				// Set a Basic marketing plan level
				App.level.push(partner[1]);

				// Check for a Fast marketing plan activation
				if (partner[2].length > 0) {

					// The Fast marketing plan is active

					// Set a Fast marketing plan level
					App.level.push(partner[2]);

					// Check for a VIP marketing plan activation
					if (partner[3].length > 0) {

						// The VIP marketing plan is active

						// Set a VIP marketing plan level
						App.level.push(partner[3]);
					}
				}

				// Set a registration of the partner date timestamp
				App.date = partner[4];

				// Set a registration of the partner block number
				App.registrationBlock = partner[5];

				// Set an array of refferals of the partner
				App.referrals = partner[6];

				// Calculate and set a number of new refferals of the partner
				App.referralsPlus = App.referrals.length - App.referralsLenght;

				// Calculate and set a number of new members of the partner's network 
				App.networkPlus = partner[7] - App.networkStart;

				// Set the number of members of the partner's network
				App.network = partner[7];

				// Get from the contract and set next level prices
				App.nextLevelPrice = await App.cryptoLife.getNextLevelPrices(App.roundId.toString(), {from:App.account});
				

				// Save the number of members of the partner's network to database    			
				if(App.networkPlus>0) App.socket.emit('setNetwork', App.network);

				// Save the number of the partner's referrals to database
				if(App.referralsPlus>0) App.socket.emit('setReferrals', App.referrals.length);
			
			}

		// Check for page render need
		if(toRender) { 

			// Page render needs

			// Render the page
			return App.render()
		}
	},	

	// Read past events from server's database 
	readPastEvents: async function (){
			for(let event of App.events){
				
				
				await this.eventHandling(event, event.blockNumber>App.lastSeenBlock).catch(()=>{});
			}
			App.render();
			// Change an account details section title
			$("#accountData > h5")[0].innerHTML = '<span id="a-title-2">'+l100n.localize_string("a-title-2")+'</span>';
			$("#accountData > h5").addClass('text-uppercase');

			// Return with listening new blocks
			App.listenForEvents();						

	},	

	// Hanndling of events function
	eventHandling: async function (_event, _needRender){

		return new Promise(async function(resolve, reject){


		  // Is it common partner's event
			if (_event.args["partnerAddress"].toLowerCase() == App.account) {

				// It's a common partner's event
	  						
	  		// Switch event type and call suitable function
				switch (_event.event){

				  case 'bonusPaidOut': 
				  	await bonusPaidOut(_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
				  	resolve(true);
				  break;

				  case 'missingBounus': 
				  	await missingBounus(_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
				  	resolve(true);
				  break;

				  case 'poolIsReopened':
				  	await poolIsReopened(_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
				  	resolve(true);
				  break;

				  case 'registration': 
				  	await registration(_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
				  	resolve(true);
				  break;

				  case 'levelUp': 
				  	await levelUp(_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
				  	resolve(true);
				  break;
				}

				// Check for referral registration case
			} else {

				if(_event.event == 'registration' && _event.args["sponsorAddress"].toLowerCase() == App.account) {

					// It's a refferal registration

					// Call new referal handling fauction
					await newReferral (_event, _needRender).catch((_error)=>{console.warn(_error); reject(_error)});
					 resolve(true);
				} else {

					reject('Unknown event');
				}
			}
		});


			async function bonusPaidOut (_event, _needRender){

				return new Promise (async function(resolve, reject){

							// Check a bonus type
							switch (_event.args["bonusType"].toString()){

								case '1':

									// It's a direct bonus

									// Check for new income									    	
									if (_event.blockNumber > App.lastSeenBlock) {

										// An income is new 
														
										// Increment direct income summ								
										App.directIncome +=_event.args["amount"];

										//Increase a direct income plus summ	  
										App.directIncomePlus += _event.args["amount"];							

										// Set direct income to the database
										App.socket.emit('setDirectIncome', App.directIncome);
									}


									// Add new nitification to the list of notifications 
									addNotification(
										'directBonus', 
										'<span class="m-bpo-p1">'+l100n.localize_string("m-bpo-p1")+'</span>' + (_event.args["amount"]).toFixed(App.cryptoDecimasNumber)+' '+App.crypto, 
										'<span class="m-bpo-p2">'+l100n.localize_string("m-bpo-p2")+'</span>'+_event.args["level"]+'<span class="m-bpo-p3">'+l100n.localize_string("m-bpo-p3")+'</span>'+ App.mp[_event.args["mp"]]+'<span class="m-bpo-p4">'+l100n.localize_string("m-bpo-p4")+'</span>',
										_event
									);
											    	
								break;

								case '0':

									// It's a Basic Income
													
									// Check for new income		    	
									if (_event.blockNumber > App.lastSeenBlock) {

										// An income is new 

										// Increment network income summ											
										App.networkIncome += _event.args["amount"];		

										// Increase a network income plus summ	  										  
										App.networkIncomePlus += _event.args["amount"];

										// Set network income to the database
										App.socket.emit('setNetworkIncome', App.networkIncome);
									}

									// Add new nitification to the list of notifications
									addNotification(
										'leaderBonus',
										'<span class="m-bpo-p5">'+l100n.localize_string("m-bpo-p5")+'</span>',
										'<span class="m-bpo-p6">'+l100n.localize_string("m-bpo-p6")+'</span>'+(_event.args["amount"]).toFixed(App.cryptoDecimasNumber)+' '+App.crypto+'<span class="m-bpo-p7">'+l100n.localize_string("m-bpo-p7")+'</span>',
										_event
									);

								break;

								default:

									// It's a network income
													
									// Check for new income		
									if (_event.blockNumber > App.lastSeenBlock) {

										// An income is new 

										// Increment network income summ	
										App.networkIncome += _event.args["amount"];

										//Increase a network income plus summ
										App.networkIncomePlus += _event.args["amount"];

										// Set network income to the database
										App.socket.emit('setNetworkIncome', App.networkIncome);
									}	

									// Add new nitification to the list of notifications
									addNotification(
										'networkBonus',
										'<span class="m-bpo-p1">'+l100n.localize_string("m-bpo-p1")+'</span>' +(_event.args["amount"]).toFixed(App.cryptoDecimasNumber)+' '+App.crypto, 
										'<span class="m-bpo-p8">'+l100n.localize_string("m-bpo-p8")+'</span>'+_event.args["bonusType"]+'<span class="m-bpo-p9">'+l100n.localize_string("m-bpo-p9")+'</span>'+_event.args["level"]+'<span class="m-bpo-p10">'+l100n.localize_string("m-bpo-p10")+'</span>'+ App.mp[_event.args["mp"]]+'<span class="m-bpo-p11">'+l100n.localize_string("m-bpo-p11")+'</span>',
										_event
									);

								break;					    	
							}
							// Update last seen block in the cookie
							updateLastSeenBlock(_event.blockNumber);

							 // Check if it need for render
							if (_needRender) {

								// It's need to render

								// Check for Basic Income paied event
								if (_event.args["bonusType"].toString() == '0'){

									// This is a Basic Income paid event

									// Update Basic Income data
									await App.loadBasicIncomeData();

									// Render Total Income
									App.changheCurrentCurrency(App.currentCurrency);

									// Render Incomes
									App.renderIncomes();

									// Render next Basic Income progress
									App.renderBasicIncomeProress();

								} else if (_event.args["bonusType"].toString() == '1') {

									await App.loadPartnerData(true);

								} else {

									// Render Total Income
									App.changheCurrentCurrency(App.currentCurrency);

									// Render Incomes
									App.renderIncomes();

								}

								// Render notifications
								App.renderNotifications();

							}

							resolve(true);					
					});		 
	  	}

			function missingBounus (_event, _needRender){

				return new Promise ((resolve, reject)=>{

					// Check for new event
					if (_event.blockNumber > App.lastSeenBlock) {

						// The event is new 
								    	
						// Increase a missing income plus sum
						App.lostProfitPlus += _event.args["amount"];

						// Increase a missing income sum
						App.lostProfit += _event.args["amount"];

						// Save missing income value to the database
						App.socket.emit('setLostProfit', App.lostProfit);

					}

					  	// Set a temporary string 
					  	let temp = '';

							// Check a missing income type
					    switch (_event.args["bonusType"].toString( )){
					    	case '1':

					    			// Check a level
						    		if (_event.args["level"] == 1) {

						    			// Missed first level income
						    			// Partner have to just activate a required marketing plan to receive bonuses

						    			// Set a reqquired marketing plan activation call prefix for a message info  
						    			temp = '<span class="m-miss-p1">'+l100n.localize_string("m-miss-p1")+'</span>'+App.mp[_event.args["mp"]];

						    			// in the case of the higher level check the required marketing plan activation
						    		} else if (App.level.length-1 < _event.args["mp"]) {

						    			// The required marketing plan is no active

						    			// Set a reqquired marketing plan activation and level up call prefix for a message info 
						    			temp = '<span class="m-miss-p1">'+l100n.localize_string("m-miss-p1")+'</span>'+App.mp[_event.args["mp"]] + '<span class="m-miss-p2">'+l100n.localize_string("m-miss-p2")+'</span>'+ _event.args["level"];
						    		} else {

						    			// The required marketing plan is active

						    			// Set a level up call prefix for a message info 
						    			temp = '<span class="m-miss-p3">'+l100n.localize_string("m-miss-p3")+'</span>'+App.mp[_event.args["mp"]]+'<span class="m-miss-p4">'+l100n.localize_string("m-miss-p4")+'</span>'+ _event.args["level"];
						    		}

						    		// Add new nitification to the list of notifications
						    		addNotification(
											'missed',
											'<span class="m-miss-p5">'+l100n.localize_string("m-miss-p5")+'</span>'+(_event.args["amount"]).toFixed(App.cryptoDecimasNumber)+' '+App.crypto,
											temp +'<span class="m-miss-p6">'+l100n.localize_string("m-miss-p6")+'</span>' +  _event.args["level"] + '<span class="m-miss-p7">'+l100n.localize_string("m-miss-p7")+'</span>',
											_event
											);

					    	break;

					    	default:

					    			// Chek for missed income type and depth
						    		if (_event.args["bonusMp"] == 2 && _event.args["bonusType"] < 4){

						    			// It's VIP network income from a depth less than four

						    			// Add description to the missed income type for the massage info
						    			temp = '<span class="m-miss-p8">'+l100n.localize_string("m-miss-p8")+'</span>';
						    		} else {
						    			temp = '<span class="m-miss-p10">'+l100n.localize_string("m-miss-p10")+'</span>';
						    		}

						    		// Add new nitification to the list of notifications
						    		addNotification(
											'missed',
											'<span class="m-miss-p5">'+l100n.localize_string("m-miss-p5")+'</span>'+(_event.args["amount"]).toFixed(App.cryptoDecimasNumber)+' '+App.crypto,
											'<span class="m-miss-p1">'+l100n.localize_string("m-miss-p1")+'</span>'+App.mp[_event.args["bonusMp"]]+'<span class="m-miss-p9">'+l100n.localize_string("m-miss-p9")+'</span>'+temp+_event.args["bonusType"]+'.',
											_event
											);

					    	break;	
					    } 

							// Update last seen block in the cookie
							updateLastSeenBlock(_event.blockNumber);

							// Check if it need for render
							if (_needRender) {

								// It's need to render

								// Update and render incomes 
								App.renderIncomes();

								// Render notifications
								App.renderNotifications();
							}
							resolve(true);

				});
   		}

			function poolIsReopened (_event, _needRender){

				return new Promise((resolve, reject)=>{
				  		
					  	// Add new nitification to the list of notifications
					    addNotification(
								'reopen'+_event.args["mp"],
								'<span class="m-re-p1">'+l100n.localize_string("m-re-p1")+'</span>',
								'<span class="m-re-p2">'+l100n.localize_string("m-re-p2")+'</span>'+App.mp[_event.args["mp"]]+'<span class="m-re-p3">'+l100n.localize_string("m-re-p3")+'</span>'+_event.args["level"]+'<span class="m-re-p4">'+l100n.localize_string("m-re-p4")+'</span>',
								_event
							);

					    // Update last seen block in the cookie
							updateLastSeenBlock(_event.blockNumber);

							// Check if it need for render
							if (_needRender) {

								// It's need to render

								// Reload the data of the partner
								App.loadPartnerData(true);
							}
							resolve (true);

				});
			}

	  	async function registration (_event, _needRender){

	  		return new Promise(async function(resolve, reject){



							// Check a marketing plan   	
					    switch (_event.args["mp"].toString()) {
					    	case '0' :

						    		// Add new nitification to the list of notifications
						    		addNotification(
											'registration',
											'<span class="m-reg-p1">'+l100n.localize_string("m-reg-p1")+'</span>',
											'<span class="m-reg-p2">'+l100n.localize_string("m-reg-p2")+'</span>'+App.mp[0] +'<span class="m-reg-p3">'+l100n.localize_string("m-reg-p3")+'</span>',
											_event
											);		    		
						    	break;
						    	case '1' :

						    		// Add new nitification to the list of notifications
						    		addNotification(
											'registration1',
											App.mp[1] + '<span class="m-reg-p4">'+l100n.localize_string("m-reg-p4")+'</span>',
											'<span class="m-reg-p5">'+l100n.localize_string("m-reg-p5")+'</span>'+App.mp[1] +'<span class="m-reg-p6">'+l100n.localize_string("m-reg-p6")+'</span>',
											_event
											);

						    	break;
						    	case '2' :
					
							    	// Add new nitification to the list of notifications
						    		addNotification(
											'registration2',
											App.mp[2] + '<span class="m-reg-p4">'+l100n.localize_string("m-reg-p4")+'</span>',
											'<span class="m-reg-p5">'+l100n.localize_string("m-reg-p5")+'</span>'+App.mp[2] +'<span class="m-reg-p7">'+l100n.localize_string("m-reg-p7")+'</span>',
											_event
											);
					
					    	break;
					    }

					    // Update last seen block in the cookie
							updateLastSeenBlock(_event.blockNumber);

							// Check if it need for render
							if (_needRender) {

								// It's need to render
						    	
						    // Update Basic Income progress data
								await App.loadBasicIncomeData();

								// Update data of the Parnter and render all
								await App.loadPartnerData(true);
							}
							resolve(true);

			  });
 	  	}

	  	function newReferral (_event, _needRender){

	  		return new Promise (async function(resolve, reject){

		  		// Check for specific registration of the owner
		    	if (_event.args["sponsorAddress"] != _event.args["partnerAddress"]) {

		    		// It's normal registaration

				    		// Check a marketing plan   
						    switch (_event.args["mp"].toString()){
						    	case '0':
						    			// It's a basic rgistration of the referral

							    		// Add new nitification to the list of notifications
							    		addNotification(
												'referral',
												'<span class="m-ref-p1">'+l100n.localize_string("m-ref-p1")+'</span>',
												'<span class="m-ref-p2">'+l100n.localize_string("m-ref-p2")+'</span>'+ _event.args["partnerID"]+'.',
												_event
												);

							    	break;
							    	default:
							    		// It's a higher marketing plan activation of the referral

							    		// Add new nitification to the list of notifications
							    		addNotification(
												'referralUpMp'+_event.args["mp"],
												'<span class="m-ref-p3">'+l100n.localize_string("m-ref-p3")+'</span>'+App.mp[_event.args["mp"]],
												'<span class="m-ref-p4">'+l100n.localize_string("m-ref-p4")+'</span>'+ _event.args["partnerID"]+'<span class="m-ref-p5">'+l100n.localize_string("m-ref-p5")+'</span>'+App.mp[_event.args["mp"]]+'<span class="m-ref-p6">'+l100n.localize_string("m-ref-p6")+'</span>',
												_event
												);

						    	break;		    		
						    }

								// Update last seen block in the cookie
								updateLastSeenBlock(_event.blockNumber);

								// Check if it need for render
								if (_needRender) {

									// It's need to render
						    	
							    // Update Basic Income progress data
									await App.loadBasicIncomeData();

									// Update data of the Parnter and render all
									await App.loadPartnerData(true);
								}

								resolve(true);
					}
				});		
   	  }

			function levelUp (_event, _needRender){

				return new Promise (async function(resolve, reject){

							// Set a tmporary string
							let temp =' ';

							// Check for the level
						  if (_event.args["level"] > 2) {

						  	// The level higher than 2

						  	// Add aditional string for the message info
						   	temp = '<span class="m-level-p4">'+l100n.localize_string("m-level-p4")+'</span>';
						  } else {

						  	// Add second Level message info
						   	temp = '<span class="m-level-p6">'+l100n.localize_string("m-level-p6")+'</span>';
						  }
							  
							// Add new nitification to the list of notifications
							addNotification(
								'levelUp'+_event.args["mp"],
								App.mp[_event.args["mp"]]+'<span class="m-level-p2">'+l100n.localize_string("m-level-p2")+'</span>'+ _event.args["level"],
								'<span class="m-level-p3">'+l100n.localize_string("m-level-p3")+'</span>'+App.mp[_event.args["mp"]]+'<span class="m-level-p5">'+l100n.localize_string("m-level-p5")+'</span>'+ (_event.args["level"]-1) +temp,
								_event
							);

							// Update last seen block in the cookie
							updateLastSeenBlock(_event.blockNumber);

							// Check if it need for render
							if (_needRender) {

								// It's need to render

								// Update data of the Parnter and render all
								await App.loadPartnerData(true);
							}
							resolve(true);

				});
	  	}

	  	// Add a notification to the notification list
	  	function addNotification(_type, _title, _info, _event){

	  		// A notification
				let mess = {};

				// Set a notification type
				mess.type = _type;

				// Set a notification title
				mess.title = _title;

				// Set a notifiation info
				mess.info = _info;

				// Set a notification date and time
				mess.dateTime =  _event.timeStamp;

				// Set a notification newness 
				// It's new if a notification event block number higer then last seen block number 
				mess.new = _event.blockNumber > App.lastSeenBlock || ((_event.blockNumber == App.registrationBlock) && (App.currentBlock == App.registrationBlock));

				// Set a notification event log index to check for duplicate events
				mess.logIndex = _event.logIndex;
					
				// Add new notiication to the list of notifications
				App.notifications.push(mess);				
	  	}

	  	// Set a new value of the last seen block if it nessesary
	  	function updateLastSeenBlock(_blockNumber){

				// Largest seen block check
				if (_blockNumber > App.lastSeenBlockNumber){

					// _Event's block number is largest

					App.socket.emit("setLastSeenBlock",_blockNumber);
								
					// Set new largest block number
					App.lastSeenBlockNumber = _blockNumber;
				}	  		
	  	}	  	 		  	
	},

	recieveMassage: function(_message, _chat)	{
	},

	// Handle events of the Contract
  listenForEvents: async function(){

  	App.socket.on('event', async (_event)=>await App.eventHandling(_event, true));

  	App.socket.on('message', (_message)=>App.recieveMassage(_message, _chat));

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
			  			$(selector).each(function(){this.innerHTML =(App.registrationPrices[i]+App.rateCorrection).toFixed(App.cryptoDecimasNumber);});  			
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

  	$(".levelUpButton").attr('disabled', true);
  	$(".levelUpFastButton").attr('disabled', true);
  	$(".levelUpVipButton").attr('disabled', true);
  	$(".levelUpButton i").hide();
  	$(".levelUpFastButton i").hide();
  	$(".levelUpVipButton i").hide();
  	$(".levelUpText").addClass("waiting");
  	$(".levelUpFastText").addClass("waiting");
  	$(".levelUpVipText").addClass("waiting");
		l100n.localize_all_pages();

 		if (levelUp) {

 			Lobibox.notify('success', {
				pauseDelayOnHover: true,
				icon: 'bx bx-chevrons-up',
				continueDelayOnInactiveTab: false,
				rounded: true,
				position: 'top center',
				msg: l100n.localize_string("a-levelup")+App.chainName
			});

			App.cryptoLife.partnerLevelUp(
				mp, 
				1, 
				App.roundId.toString(), 
				{from:App.account, value:App.nextLevelPrice[mp]*1+App.rateCorrection*10**18}
			)
			.then(()=>{window.location.reload})
			.catch(function(error){

				Lobibox.notify('warning', {
					pauseDelayOnHover: true,
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: error.message
				});
				$(".levelUpButton").attr('disabled', false);
				$(".levelUpFastButton").attr('disabled', false);
				$(".levelUpVipButton").attr('disabled', false);
  			$(".levelUpButton i").show();
  			$(".levelUpFastButton i").show();
  			$(".levelUpVipButton i").show();
  			$(".levelUpText").removeClass("waiting");
  			$(".levelUpFastText").removeClass("waiting");
  			$(".levelUpVipText").removeClass("waiting");
  			l100n.localize_all_pages();
				console.warn(error);
 			});

 		} else {

 			let price = 0;
 			if(App.partnerId >0){
 				price = App.nextLevelPrice[mp]+App.rateCorrection*10**18;
 			} else {
 				price = (App.registrationPrices[mp]+App.rateCorrection)*10**18;
 			}

 			if (App.balance/10**18 > price/10**18) {

 				Lobibox.notify('success', {
					pauseDelayOnHover: true,
					icon: 'bx bx-check-double',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: l100n.localize_string("a-reg")+App.chainName
				});

	 			App.cryptoLife.registerNewPartner( 
	 				App.sponsorId, 
	 				mp, 
	 				App.roundId.toString(), 
	 				{from:App.account, value:price}
	 			)
	 			.then(()=>{window.location.reload})
	 			.catch(function(error){

					Lobibox.notify('warning', {
						pauseDelayOnHover: true,
						icon: 'bx bx-error',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: error.message
					});

				$(".levelUpButton").attr('disabled', false);
				$(".levelUpFastButton").attr('disabled', false);
				$(".levelUpVipButton").attr('disabled', false);
  			$(".levelUpText").removeClass("waiting");
  			$(".levelUpFastText").removeClass("waiting");
  			$(".levelUpVipText").removeClass("waiting");
  			$(".levelUpButton i").show();
  			$(".levelUpFastButton i").show();
  			$(".levelUpVipButton i").show();
  			l100n.localize_all_pages();
					console.warn(error);
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

				$(".levelUpButton").attr('disabled', false);
				$(".levelUpFastButton").attr('disabled', false);
				$(".levelUpVipButton").attr('disabled', false);
  			$(".levelUpText").removeClass("waiting");
  			$(".levelUpFastText").removeClass("waiting");
  			$(".levelUpVipText").removeClass("waiting");
  			$(".levelUpButton i").show();
  			$(".levelUpFastButton i").show();
  			$(".levelUpVipButton i").show();
  			l100n.localize_all_pages();
	 		}
 		}
 	},

	changeLang: function(_locale){

		l100n.locale = _locale;
		l100n.localize_all_pages();

		//Cookie expiration date
		let date = new Date;

		//Add one year
		date.setDate(date.getDate() + 360); 

		//Convert to UTC format
		date = date.toUTCString();

		// Save the language settings to cookies   			
		document.cookie = 'cryptolife_lang='+_locale+'; path=/; expires=' + date;

		$(".dropdown-language .lang i").attr('class', App.langs[_locale].flag);
		$(".dropdown-language .lang span")[0].innerHTML= App.langs[_locale].name;

		if(App.partnerId>0){

			// Render Basic Income progress
			App.renderBasicIncomeProress();

		 	App.renderRefferalLinks();
			$(".levelCard").each(function(){
				let mp = ['#basic', '#fast', 'vip'];
				for (let i=0; i<mp.length; i++){

					let slotsTooltip = $(this).find(mp[i] +" #slotsTooltip");
					let reopensTooltip = $(this).find(mp[i] +" #reopensTooltip");
					let priceTooltip = $(this).find(mp[i] + " #priceTooltip");
				  let warningSpanD =	$(this).find(mp[i] +" #name.text-danger");
				  let warningSpanW =	$(this).find(mp[i] +" #name.text-warning");
					
					slotsTooltip.attr('data-original-title', l100n.localize_string("a-slotsTooltip-p1")+App.mp[i]+l100n.localize_string("a-slotsTooltip-p2"));
					priceTooltip.attr('data-original-title', l100n.localize_string("a-priceTooltip-p1")+App.mp[i]+l100n.localize_string("a-priceTooltip-p2"));
					reopensTooltip.attr('data-original-title', l100n.localize_string("a-reopensTooltip-p1")+App.mp[i]+l100n.localize_string("a-reopensTooltip-p2"));
					warningSpanD.attr('data-original-title', l100n.localize_string("a-levelWarning-d-p1")+App.mp[i]+l100n.localize_string("a-levelWarning-d-p2"));
					warningSpanW.attr('data-original-title',l100n.localize_string("a-levelWarning-w-p1")+App.mp[i]+l100n.localize_string("a-levelWarning-w-p2"));
				}
				let buttonFastPriceTooltip = $(this).find("#buttonFast #priceTooltip");
				let buttonVipPriceTooltip = $(this).find("#buttonVip #priceTooltip");

				buttonFastPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[1]+l100n.localize_string("a-levelup-p2"));
				buttonVipPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[2]+l100n.localize_string("a-levelup-p2"));

			});

	  	let nextLevelCard = $("#nextLevelCard");
					
			let buttonPriceTooltip = nextLevelCard.find("#basic #priceTooltip");
			let buttonFastPriceTooltip = nextLevelCard.find("#buttonFast #priceTooltip");
			let buttonVipPriceTooltip = nextLevelCard.find("#buttonVip #priceTooltip");

			buttonPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[0]+l100n.localize_string("a-levelup-p2"));
			buttonFastPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[1]+l100n.localize_string("a-levelup-p2"));
			buttonVipPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[2]+l100n.localize_string("a-levelup-p2"));		    	
		}
	},


	renderLangs: function(){
		$(".dropdown-language .dropdown-item").each(function(){
			
			$(this).off('click').on('click',()=>{
				let lng = $(this).attr('lang');
				App.changeLang(lng)

			});
		});

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
  renderExchangeRates:  async function (){

  	return new Promise((resolve, reject)=>{

	   	var requestURL = 'https://min-api.cryptocompare.com/data/price?fsym='+App.crypto+'&tsyms=USD,ILS,JPY,EUR,WAN,RUB,GBP ';

			var request = new XMLHttpRequest();

			request.open('GET', requestURL);

			request.responseType = 'json';

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
				resolve (true);
			}

			request.onError = function() {
				Lobibox.notify('warning', {
					pauseDelayOnHover: true,
					icon: 'bx bx-error',
					continueDelayOnInactiveTab: false,
					rounded: true,
					position: 'top center',
					msg: request.statusText
				});

				console.log(request.statusText);
				reject(request.statusText);
			}

			request.send();
  	});       
  },

  initExchangeRates: async function(){

		$('#USD').off('click').on('click', ()=>switchCurrency('USD'));
	  $('#EUR').off('click').on('click', ()=>switchCurrency('EUR'));    
	  $('#ILS').off('click').on('click', ()=>switchCurrency('ILS'));
	  $('#GBP').off('click').on('click', ()=>switchCurrency('GBP'));
	  $('#JPY').off('click').on('click', ()=>switchCurrency('JPY'));
	  $('#WAN').off('click').on('click', ()=>switchCurrency('WAN'));
	  $('#RUB').off('click').on('click', ()=>switchCurrency('RUB'));
 		
    function switchCurrency(_currency) {

    	// Change current currency to USD
      App.changheCurrentCurrency(_currency);

			// Cookie expiration date
			let date = new Date;

			// Add one year
			date.setDate(date.getDate() + 360); 

			// Convert to UTC format
			date = date.toUTCString(); 
			document.cookie = App.account +'_currentCurrency='+_currency+'; path=/; expires=' + date;
    }

    await App.renderExchangeRates();
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
	  				mess.find("#messIcon i").attr("class",'lni lni-investment');
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
	  					$(this).find("span").removeClass('activation')[0].innerHTML = l100n.localize_string("levelUpFastText");
	  				});
	  				$(".modalLevelFast").each(function(){
	  					this.innerHTML = App.level[1].length+1;
	  				});
	  				$("#modalCurrentLevelFast")[0].innerHTML = App.level[1].length;
	   			if (App.level.length>2){
	  				$(".levelUpVipButton").each(function(){
	  					this.setAttribute('data-target','#levelUpVipModal'); 
	  					$(this).find('i').removeClass('bx-check-double').addClass('bx-chevrons-up');
	  					$(this).find("span").removeClass('activation')[0].innerHTML = l100n.localize_string("levelUpVipText");
	  				});
	  				$(".modalLevelVip").each(function(){this.innerHTML = App.level[2].length+1});
	  				$("#modalCurrentLevelVip")[0].innerHTML = App.level[2].length;
	   			} else {

	   				$(".levelUpVipButton").each(function(){
	   					this.setAttribute('data-target','#registrationVipModal');
	   					$(this).find('i').removeClass('bx-chevrons-up').addClass('bx-check-double');
	   					
	   				});
	   				$(".levelUpVipText").each(function(){

	   					$(this).addClass('activation');
	   					this.innerHTML=l100n.localize_string("levelUpVipTextA");
	   				});
	   			}
	  		} else {
	  			$(".levelUpFastText").each(function(){

	   					$(this).addClass('activation');
	   					this.innerHTML=l100n.localize_string("levelUpFastTextA");
	  			});
	  			$(".levelUpVipText").each(function(){

	   					$(this).addClass('activation');
	   					this.innerHTML=l100n.localize_string("levelUpVipTextA");
	  			});
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
	  				$(this).addClass('activation');
	  				this.innerHTML = l100n.localize_string('a-modal-reg-b2');
	  			})
	  		}

  		});
  },

  // Render an Incomes block of the Account section 
  renderIncomes: function(){

		$("#directIncome")[0].innerHTML = App.directIncome.toFixed(App.cryptoDecimasNumber);
	  if (App.directIncomePlus >0){
	    $("#directIncomePlus").show();
	    $("#directIncomePlus")[0].innerHTML ='+' + App.directIncomePlus.toFixed(App.cryptoDecimasNumber);
	  } else {
	    $("#directIncomePlus").hide();
	  }

	  $("#networkIncome")[0].innerHTML = App.networkIncome.toFixed(App.cryptoDecimasNumber);
	  if (App.networkIncomePlus >0){
	    $("#networkIncomePlus").show();
	    $("#networkIncomePlus")[0].innerHTML ='+' + App.networkIncomePlus.toFixed(App.cryptoDecimasNumber);
	  } else {
	    $("#networkIncomePlus").hide();
	  }

	  $("#incomeCrypto")[0].innerHTML = (App.directIncome + App.networkIncome).toFixed(App.cryptoDecimasNumber);
	  if (App.networkIncomePlus + App.directIncomePlus >0){
	    $("#incomeCryptoPlus").show();
	    $("#incomeCryptoPlus")[0].innerHTML ='+';
	    $("#incomeCryptoPlus")[0].innerHTML += (App.networkIncomePlus + App.directIncomePlus).toFixed(App.cryptoDecimasNumber);
	  } else {
	    $("#incomeCryptoPlus").hide();
	  }

	  $("#lostProfit")[0].innerHTML = App.lostProfit.toFixed(App.cryptoDecimasNumber);
	  if (App.lostProfitPlus >0){
	    $("#lostProfitPlus").show();
	    $("#lostProfitPlus")[0].innerHTML ='+' + App.lostProfitPlus.toFixed(App.cryptoDecimasNumber);
	  } else {
	    $("#lostProfitPlus").hide();
	  }  	
  },

  // Render a Basic Income progress block of the Account section
  renderBasicIncomeProress: function(){
    
    // Top Leader card data

    let topMess ='';

    /*
    if (App.topLeader == App.account) {

	   	topMess = l100n.localize_string("a-top-x1");
	  } else {

		  if (App.level.length < 3 || App.level[2].length < App.basicIncomeMinimumLevel) {

		   	topMess = 	l100n.localize_string("a-top-x2")+App.mp[2]+l100n.localize_string("a-top-x3")+ App.basicIncomeMinimumLevel;
		  }

		  if (App.topDelta <= App.basicIncomeResult) {

			 	if (topMess.length > 0) { 

			 		topMess += l100n.localize_string("a-top-x4");
			 	} else { 

	    		topMess = l100n.localize_string("a-top-x5");
	    	}

	    	let delta = App.basicIncomeResult - App.topDelta;
	    	delta ++;
	    	topMess+= delta + ' <i class="bx bx-group"></i>';
	    }
	 
	    if (topMess.length>0) {

	    	topMess += l100n.localize_string("a-top-x6");

	    } else {

	    	topMess = l100n.localize_string("a-top-x7");
	    }

	    if (topMess.length > 45){

	    	$("#topMess").removeClass("mb-3").addClass("m-0");
	   	 	$(".list-group-flush").each(function(){$(this).removeClass("mb-0").addClass("mb-1")});
	  	}
	 	}

	 	*/

	 	if (App.level.length < 3 || App.level[2].length < App.basicIncomeMinimumLevel) {

	 		topMess = 	l100n.localize_string("a-top-x2")+App.mp[2]+l100n.localize_string("a-top-x3")+ App.basicIncomeMinimumLevel;

	    if (topMess.length>0) {

	    	topMess += l100n.localize_string("a-top-x6");

	    } else {

	    	topMess = l100n.localize_string("a-top-x7");
	    }
	    if (topMess.length > 45){

	    	$("#topMess").removeClass("mb-3").addClass("m-0");
	   	 	$(".list-group-flush").each(function(){$(this).removeClass("mb-0").addClass("mb-1")});
	  	}
	 	} else {

	 		topMess = l100n.localize_string("a-top-x1");
	 	}

 		$("#topMess")[0].innerHTML = topMess;
  },

  // Render refferal links
  renderRefferalLinks: function(){

  	$("#userIdContainer .dropdown-menu a").each(function(_number){

  			$(this).off('click').on('click', function(){reffealAction(_number)});
  			$(this).find("span")[0].innerHTML = l100n.localize_string("refLink"+_number);
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
						msg: l100n.localize_string("refLink0-n")
					});						
  			break;
  			case 1: 
  				navigator.clipboard.writeText(window.location.host+'/marketing.html?ref='+App.partnerId);
		   		Lobibox.notify('success', {
						pauseDelayOnHover: false,
						icon: 'bx bx-copy',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: l100n.localize_string("refLink1-n")
					});						
  			break;
  			case 5:
  				window.open('https://www.facebook.com/sharer.php?u='+window.location.host+'?ref='+App.partnerId,'sharer','status=0,toolbar=0,width=650,height=500');
  			break;
  		}
  	}

  	$("#walletContainer .dropdown-item").each(function(_number){

  		$(this).off('click').on('click', function(){binanceAction(_number)});
  	});

  	function binanceAction(_number){
  		switch (_number){
  			case 0: window.open('https://www.binance.com/'+l100n.locale+'/buy-sell-crypto?fiat='+App.currentCurrency+'&crypto='+App.crypto+'&ref=HDJONDBN', '_blank').focus();
  			break;
  			case 1: window.open('https://www.binance.com/'+l100n.locale+'/buy-sell-crypto?fiat='+App.currentCurrency+'&crypto='+App.crypto+'&ref=HDJONDBN&type=SELL', '_blank').focus();
  			break;
  		}
  	}
  },

  // Render prices
  renderPrices: function(){

  	$(".levelCard").each(function(i){

	    $(this).find("#levelPrice")[0].innerHTML = (App.registrationPrices[0]*2**i+App.rateCorrection).toFixed(App.cryptoDecimasNumber);
	    let fastRegPrice = App.registrationPrices[1] - App.registrationPrices[0];
	    let vipRegPrice = App.registrationPrices[2] - App.registrationPrices[1];	    	
	    $(this).find(".levelFastPrice").each(function(){this.innerHTML = (fastRegPrice*2**i+App.rateCorrection).toFixed(App.cryptoDecimasNumber);});
			$(this).find(".levelVipPrice").each(function(){this.innerHTML = (vipRegPrice*2**i+App.rateCorrection).toFixed(App.cryptoDecimasNumber);});  	
  	});
	  $(".nextLevelPrice").each(function(){this.innerHTML = (App.nextLevelPrice[0]/10**18+App.rateCorrection).toFixed(App.cryptoDecimasNumber)});
	  $(".nextLevelPriceFast").each(function(){this.innerHTML = (App.nextLevelPrice[1]/10**18+App.rateCorrection).toFixed(App.cryptoDecimasNumber)});
	  $(".nextLevelPriceVip").each(function(){this.innerHTML = (App.nextLevelPrice[2]/10**18+App.rateCorrection).toFixed(App.cryptoDecimasNumber)});
  	for (i = 0; i<App.registrationPrices.length; i++){

  		let selector = ".mp"+i+"Price";
  		$(selector).each(function(){this.innerHTML = (App.nextLevelPrice[i]/10**18+App.rateCorrection).toFixed(App.cryptoDecimasNumber);});
  			
  	}
  },

  // Render an Account section of the page
  render: function() {

  	$('#balance')[0].innerHTML = (App.balance/10**18).toFixed(App.cryptoDecimasNumber);
  	$('#cryptoLogo').attr("src","img/"+App.crypto+".png");
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
		
		  	let nextLevelCard = App.nextLevelCard.clone(true); 
			  let pools = $("#pools");

			  pools.empty();
			  let row = $('<div class="row"></div>');

		    $("#topSumm")[0].innerHTML = App.basicIncomeSumm/10**18;
		    
		    $("#topLeaderBar").css("width", App.basicIncomeBalance/App.basicIncomeResult*100+"%");
		    console.log(App.basicIncomeBalance/10**18, App.basicIncomeResult/10**18);
	  		$("#userId")[0].innerHTML = App.partnerId;

	  		App.renderNotifications();
	  		App.renderIncomes();
	  		App.renderBasicIncomeProress();
	  		App.renderRefferalLinks();

	    	// Set a text on the Basic level up button
	    	$(".levelUpText").each(function(){ this.innerHTML = l100n.localize_string("levelUpText");});

	    	// Set a current level of the Basic marketing plan
	    	$("#level")[0].innerHTML = App.level[0].length;

	    	if (App.level[0].length >= App.maxLevel){
	    		$("#lightMaxLevelText").show();
	    		$("#lightNextLevelPrice").hide();
	    		$("#lightLeveUpButton").hide();
	    	}

	     	// Check level of the Fast marketing plan
	    	if(App.level.length>1){

	    		// Set a text on the Fast level up button
	    		$(".levelUpFastText").each(function(){ this.innerHTML = l100n.localize_string("levelUpFastText");});

	    		// Show a current level of the Fast marketing plan
	    		$("#levelFast").show();

	    		// Set a current level of the Fast marketing plan
	    		$("#levelFast span")[0].innerHTML = App.level[1].length;

	    		if (App.level[1].length >= App.maxLevel){
		    		$("#fastMaxLevelText").show();
		    		$("#fastNextLevelPrice").hide();
		    		$("#fastLeveUpButton").hide();
		    	}

	    	}		

	    	// Check level of the VIP marketing plan
	    	if(App.level.length>2){

	    		// Set a text on the VIP level up button
	    		$(".levelUpVipText").each(function(){ this.innerHTML = l100n.localize_string("levelUpVipText");});

	    		// Show a current level of the VIP marketing plan
	    		$("#levelVip").show();	

	    		// Set a current level of the VIP marketing plan
	    		$("#levelVip span")[0].innerHTML = App.level[2].length;

	    		if (App.level[2].length >= App.maxLevel){
		    		$("#vipMaxLevelText").show();
		    		$("#vipNextLevelPrice").hide();
		    		$("#vipLeveUpButton").hide();
		    		$("#vipMaxLevelText").parent().parent().parent().addClass("pb-2");
		    	}
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
				    slotsTooltip.attr('data-original-title', l100n.localize_string("a-slotsTooltip-p1")+App.mp[mp]+l100n.localize_string("a-slotsTooltip-p2"));
				    slotsTooltip.css('cursor','pointer');
				    slotsTooltip.attr('data-placement',"bottom");//.tooltip('enable');

				    priceTooltip.attr('data-original-title', l100n.localize_string("a-priceTooltip-p1")+App.mp[mp]+l100n.localize_string("a-priceTooltip-p2"));
				    priceTooltip.css('cursor','pointer');
				    priceTooltip.attr('data-placement',"bottom");//.tooltip();
				    
				    reopensTooltip.attr('data-original-title', l100n.localize_string("a-reopensTooltip-p1")+App.mp[mp]+l100n.localize_string("a-reopensTooltip-p2"));
				    reopensTooltip.css('cursor','pointer');
				    reopensTooltip.attr('data-placement',"bottom");//.tooltip();

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
				    			warningSpan.attr('data-original-title', l100n.localize_string("a-levelWarning-d-p1")+App.mp[mp]+l100n.localize_string("a-levelWarning-d-p2"));
				    			warningSpan.css('cursor','pointer');
				    			warningSpan.attr('data-placement',"bottom");//.tooltip();

				    		} else {

				    			warningSpan.removeClass('text-white').addClass('text-warning');
				    			warningSpan.attr('data-original-title',l100n.localize_string("a-levelWarning-w-p1")+App.mp[mp]+l100n.localize_string("a-levelWarning-w-p2"));
				    			warningSpan.css('cursor','pointer');
				    			warningSpan.attr('data-placement',"bottom");//.tooltip();
				    		}
				    	}

			    	}	    		
		    	}

					let buttonFastPriceTooltip = levelCard.find("#buttonFast #priceTooltip");
					let buttonVipPriceTooltip = levelCard.find("#buttonVip #priceTooltip");

					buttonFastPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[1]+l100n.localize_string("a-levelup-p2"));
					buttonVipPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[2]+l100n.localize_string("a-levelup-p2"));		    	

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

		    if (App.level[0].length < App.maxLevel) {

			    
			    nextLevelCard.find("#poolLevel")[0].innerHTML=App.level[0].length+1;

					let buttonPriceTooltip = nextLevelCard.find("#basic #priceTooltip");
					buttonFastPriceTooltip = nextLevelCard.find("#buttonFast #priceTooltip");
					buttonVipPriceTooltip = nextLevelCard.find("#buttonVip #priceTooltip");

					buttonPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[0]+l100n.localize_string("a-levelup-p2"));
					buttonFastPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[1]+l100n.localize_string("a-levelup-p2"));
					buttonVipPriceTooltip.attr('data-original-title', l100n.localize_string("a-levelup-p1")+App.mp[2]+l100n.localize_string("a-levelup-p2"));		    	

		    } else {

		    	nextLevelCard.hide();
		    }

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

	  		window.location.assign('marketing.html');
	  	}
	  	App.setModals();

	  	App.renderLangs();

	  	$('[data-toggle="tooltip"]').tooltip();    	
    }
  },

  // Set a page to the defaul state
  setDefaults: function (){
  	// Set coin 
  	$(".crypto").each(function(){this.innerHTML = App.crypto});

  	// Set blockchain name
  	$(".chainName").each(function(){this.innerHTML = App.chainName});

  	// Set site name
  	$(".siteName").each(function(){this.innerHTML = window.location.host; });

  	// Set contract address
  	$(".contractAddress").each(function(){this.innerHTML = App.contractAddress; });

  	// Set names of the marketing plans 
  	$(".mp0").each(function(){this.innerHTML = App.mp[0]});
  	$(".mp1").each(function(){this.innerHTML = App.mp[1]});
  	$(".mp2").each(function(){this.innerHTML = App.mp[2]});

  	// Show exchange rates of the current project coin
  	App.initExchangeRates();

  	// Render languages switcher
  	App.renderLangs();

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
		if ($("#nextLevelCard")) {
			App.nextLevelCard = $("#nextLevelCard").detach();  
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
