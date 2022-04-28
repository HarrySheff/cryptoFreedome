App = {
  web3Provider: null,
  contracts: {},
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
	cryptoDecimasNumber: 4,
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

  	// Hide the registration section of the page
  	App.showRegistration(false);

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

					// Log an error
					console.log('No Wallet connected.');

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

		    }

		  } catch (error) {

		    // User denied account access


		    // Log the error
		    console.warn("User denied account access");

		  }

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

		  				let options = {
		  					chainId:App.mainChainId,
		  					chainName: App.chainName,
		  					rpcUrls:[App.providerAddress],
		  					iconUrls: [window.location.host+'/img/bnb.png'],
		  					nativeCurrency:{
		  						name:'BNB',
		  						symbol:'BNB',
		  						decimals: 18
		  					},
		  					blockExplorerUrls:[App.explorerUrl]	
		  				}

		  				ethereum.request({ 
		  					method:"wallet_addEthereumChain", 
		  					params:[options]
		  				}).then(function(){
		  						ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:App.mainChainId}]});
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
		  } 

		}	else {

			// If no injected web3 instance is detected, connect to the testnet

			// Set the web3 proveder
		  App.web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');

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
		let temp = getRefiralFromLink();

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

			// Log an account receive error
		  console.log('No account receive from Wallet');

		} else {

			// The account value is setted


			// Get the account balance
			App.getBalance();

			// Log step finish message
			console.log('--- Account initiated ---');	
		}

		// Get current currency
		temp = App.getValueFromCookies('currentCurrency', App.account, true);

		// Check for null and zero values
		if (temp != null && temp !=0)	App.currentCurrency = temp;

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

			// Redirect to the account page
			window.location.assign('account.html'+window.location.search);

 		} else {

			// The account is not registered

			// Get current block number
			await web3.eth.getBlockNumber(function(err, blockNumber){

				// Set registration block as current for listening of the events
				App.registrationBlock = blockNumber; 
			});
		}

		// Load a Basic Income data
		await App.loadBasicIncomeData();

		// Load a registration prices
		await App.loadRegistrationPrices();

		// Start timer for a prices update
		App.startPricesTimer();

		// Log the step finish 
 		console.log('--- Contract Data loaded ---');		

 		// Render the page
		return App.render();
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


  // Switch languages 
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

  // Set modals windows data for all sections
  setModals: function(){

  		$(".levelUpButton").each(function(){this.setAttribute('data-target','#levelUpModal'); });
	
  		$(".registrationModal").each(function(k){

	  		$(this).find('#modalRegistrationBtn').off('click').on('click',function(){
	  				window.location.assign('register.html?mp=' + k+'&ref='+App.sponsorId);
	  		});
  			$(this).find(".registrationText").each(function(){
	  				$(this).addClass('activation');
	  				this.innerHTML = l100n.localize_string('a-modal-reg-b1');
	  			})

  		});
  },

  // Show a New Partner registration section of the page
  showRegistration: function() {


	 		$(".regTopLederBonus").each(function(){this.innerHTML = App.basicIncomeSumm/10**18;});
	  	for (i = 0; i<App.registrationPrices.length; i++){

	  		let selector = ".mp"+i+"Price";
	  		$(selector).each(function(){this.innerHTML = (App.registrationPrices[i]+App.rateCorrection).toFixed(App.cryptoDecimasNumber);});
	  			
	  	}
  		$("#registration").show();
  		$("#userIdContainer").hide();
  		$("#accountData").hide();
  		$("#messageContainer").hide();
			$(".nav-container").hide();
			$("#registrationFastModal #agreement").show();
			$("#registrationVipModal #agreement").show();
			$("#registrationFastModal #fullList").show();
			$("#registrationVipModal #fullList").show();			
			$("#registrationFastModal #shortList").hide();
			$("#registrationVipModal #shortList").hide();			
			$("#registrationVipModal #mediumList").hide();	
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

  	$('#cryptoLogo').attr("src","img/"+App.crypto+".svg");
  	App.renderExchangeRates();

    
    if (App.account != '0x0000000000000000000000000000000000000000' && App.account != undefined){
    	$('#walletContainer').show();
  		$('#balance')[0].innerHTML = (App.balance/10**18).toFixed(App.cryptoDecimasNumber);
	    $("#userAccountBage").removeClass("badge-danger").addClass("badge-success");
	    $("#userAccountBage")[0].innerHTML = "Online";    	

	  	if (App.account.length > 12) {
	  		$("#userAccount")[0].innerHTML = App.account.substr(0,12)+'...'+App.account.substr(App.account.length-10);
	  	}
  	} else {
    	$('#walletContainer').hide();
    }

    if (!App.hasError){
    	App.showError(false);

  		App.showRegistration();

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

  	// Hide wallet section in the menu
  	$('#walletContainer').hide();

  	// Show exchange rates of the current project coin
  	App.initExchangeRates();

  	// Render languages switcher
  	App.renderLangs();

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
