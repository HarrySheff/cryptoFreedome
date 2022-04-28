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
  nextLevelPrice: [0, 0, 0],
  registrationBlock: 0,
  currentBlock:0,
	sponsorId: 1,
	mp:['Light', 'Smart', 'Prime'],
	registrationPrices: [],
	roundId: 0,
	steps: {'wallet':false, 'chain':false, 'contract':false, 'balance':false},
	correction: 0.001,
	transactionFee: 0.006,
	langs: {'en':{'name':'En', 'flag':'flag-icon flag-icon-um'}, 'ru':{'name':'Ру', 'flag':'flag-icon flag-icon-ru'}}, // It's inportant to use lower case
	mode: 'test',
	providerAddress: 	[
		'https://data-seed-prebsc-1-s1.binance.org:8545/',
		'https://data-seed-prebsc-2-s1.binance.org:8545/',
		'https://data-seed-prebsc-1-s2.binance.org:8545/',
		'https://data-seed-prebsc-2-s2.binance.org:8545/',
		'https://data-seed-prebsc-1-s3.binance.org:8545/',
		'https://data-seed-prebsc-2-s3.binance.org:8545/'
	],
	explorerUrl: 'https://testnet.bscscan.com',

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

  	App.setDefaults();
  	l100n.default_locale = "en";

  	if (App.mode != 'test'){
  		App.chainName = 'Smart Chain';
  		App.mainChainId = '0x38';
  		App.providerAddress = [
	  		'https://bsc-dataseed.binance.org/',
				'https://bsc-dataseed1.defibit.io/',
				'https://bsc-dataseed1.ninicoin.io/'
			];
  		App.explorerUrl = 'https://bscscan.com';
  	}


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

		// Get sonsor ID from link
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

		// Get marketing plan from link
		function getMpFromLink() {

			// Split link on parts with and without arguments
			let valueParts = window.location.href.split("?");

			// Check parts number
			if(valueParts.length == 2) {

				// Arguments part exist

				// Set arguments string
				let value = "&"+valueParts[1];

			  // Split arguments string on parts with and without sponsor ID
			  let parts = value.split("&mp=");

			  // If exist second part, return a value from start to splitter "&"
			  if (parts.length == 2) return parseInt(parts.pop().split("&").shift(),10);

			}

			return 0;
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

			//Convert to UTC format
			date = date.toUTCString();

			// Save sponsor ID  in the cooke
			document.cookie = 'cryptolife_ref='+temp+'; path=/; expires=' + date;
						
		} else {

			// The sponsor ID value is null

			// Get the sponsor ID from the cookies 
			App.sponsorId = App.getValueFromCookies('ref', 'cryptolife', true);

			if (App.sponsorId == undefined || App.sponsorId == null || App.sponsorId == 0){
				App.sponsorId = 1;
			}
		}

		// Get Marketing Plan form link

		// Get sponsor ID from link 
		temp = getMpFromLink();
		if (temp != null ) {
			App.regMP = temp;
			console.log( "MP: " + App.regMP);
		} else {

			App.regMP = 0;
			console.log( "Set default MP: 0");
		}

		// Get language from the cookies 
		temp = App.getValueFromCookies('lang', 'cryptolife', true);

		// Check for null and zero values
		if (temp!= null && temp !=0) {

			App.changeLang(temp);
		}	else {
			App.changeLang('en');
		}

		console.log('--- App initiated ---');
		return App.initWeb3();
  },

  // Web3 initiation
  initWeb3: async function() {
    



    // Modern dapp browsers...
		if (window.ethereum) {

			// Set an web3 proveder
		  App.web3Provider = window.ethereum;

			window.ethereum.on('accountsChanged', (accounts) => {
				// Handle the new accounts, or lack thereof.
				// "accounts" will always be an array, but it can be empty.
				if (accounts.length === 0) {
					// the Wallet is locked or the user has not connected any accounts
					console.log('Please connect to the Wallet.');

				} else if (accounts[0] !==  App.account) {
				  App.account = accounts[0];
				}
					  		 
				window.location.reload();
			});

			window.ethereum.on('login', ()=> console.log('logined'));

			window.ethereum.on('chainChanged', (chainId) => {
			 	// Handle the new chain.
		  	// Correctly handling chain changes can be complicated.
			  // We recommend reloading the page unless you have good reason not to.

			  window.location.reload();
			});


		  try {
		  	console.log('--- Try request an account ---');

		    // Request account access

		    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		    
		    if (accounts && accounts.length > 0){
		    	App.account = accounts[0];
		    	App.renderPass('wallet');
		    } 

		  } catch (error) {
		    // User denied account access...
		    console.warn("User denied account access");

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
		  }

		  if (App.chainId == App.mainChainId){

	  		App.renderPass('chain');
		  } 
		} else if (window.web3) {
		  
			  let temp = await web3.eth.getAccounts();
				App.account = temp[0];

		}	else {

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

  	try {
	    $.getJSON("../contracts/CryptoLife.json", function (data) {

	      // Instance a new truffle contract from the artifact
	      App.contracts.CryptoLife = TruffleContract(data);
	      
	      //Connect provider to interact with contract
	      App.contracts.CryptoLife.setProvider(App.web3Provider);

	      console.log('--- Contract initiated ---');
	      return App.initAccount();

	    });
	  } catch (error) {

	  	return App.render();
	  }  
  },

  // A Current Address data load from cookies and wallet
  initAccount: async function(){

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
		    App.balance = balance/10**18;
		  }
		});

			console.log('--- Account initiated ---');	

  	return App.deployContract();
  },

  // The Contract deployment  
  deployContract: async function () {
  	
    // Get deployed contract

    App.contracts.CryptoLife.deployed().then(function(instance){
   		App.cryptoLife = instance;
   		console.log('--- Contract deployed ---');
   		App.renderPass('contract');
   		return App.loadContractData();
    })
    .catch(function(error){

  		console.warn(error);
  		App.render();
  	});
	},

	// Registration check the Сurrent address in the Сontract
	checkRegistration: async function(){

		let isRegistered = await	App.cryptoLife.isRegistered({from:App.account}).catch(function(error) {

		      console.warn(error);

		      return false;
		      
		    });

		return isRegistered;			
	},

	// Check the registration of the Сurrent address and load the corresponding data
	loadContractData: async function(init) {

		if (await App.checkRegistration()){

			window.location.assign('account.html'+window.location.search);

		} else {

			await App.loadRegistrationPrices();

	 		console.log('--- Contract Data loaded ---');

	 		if (App.steps['wallet'] && App.balance >= App.registrationPrices[App.regMP] + App.correction+App.transactionFee){
	 			
	 			App.renderPass('balance');
	 		} 
	 		await App.renderExchangeRates();
	 		return App.render();
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

    // Render an Exchanre rates list in the header section
  renderExchangeRates: async function (){

  	return new Promise((resolve, reject)=>{

	   	var requestURL = 'https://min-api.cryptocompare.com/data/price?fsym='+App.crypto+'&tsyms=USD,ILS,JPY,EUR,WAN,RUB,GBP ';

			var request = new XMLHttpRequest();

			request.open('GET', requestURL);

			request.responseType = 'json';

			request.onload = function() {
				App.exchange = request.response;
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

	renderPass: function (step){

		App.steps[step] = true;
	},

	changeLang: function(_locale){

		l100n.locale = _locale;
		l100n.localize_all_pages();

		if (App.widget){
			App.widget.setLocale(l100n.locale).render().then(()=>{

				 $('#binanceWidget > div > div:nth-child(2)').attr('style','box-sizing: border-box; display: flex; font-size: 24px; white-space: nowrap;');
			});
		}

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

		$(".binanceLink").each(function(){

			$(this).attr('href','https://www.binance.com/'+_locale+'/buy-sell-crypto?channel=card&fiat=USD&ref=HDJONDBN&crypto=BNB');
		});

	},

	renderLangs: function(){
		$(".dropdown-language .dropdown-item").each(function(){
			
			$(this).off('click').on('click',()=>{
				let lng = $(this).attr('lang');
				App.changeLang(lng)

			});
		});

	},

	renderWidget: function (){

    let t = $('#binanceWidget');
    App.widget = window.binanceFiatWidget.Widget(t, {
      locale : l100n.locale,
      width: '100%',
      urlParmas: {
        ref: 'HDJONDBN'
      },
      coinInfo: {
        fiat: App.currentCurrency,
        crypto: App.crypto,
        isInUS: false
      }      
    });		
	},

	render: function (){

		$(".mp0Price").each(function(){
			this.innerHTML = App.registrationPrices[0].toFixed(6);
		})
		let cardShown =false;
		let checkPass = true;
		let counter = 0;
		App.renderWidget();
		App.renderLangs();

    $('#binanceWidget > div > div:nth-child(2)').attr('style','box-sizing: border-box; display: flex; font-size: 24px; white-space: nowrap;');

		$(".minimumSummToRegister").each(function(){this.innerHTML = (App.registrationPrices[0]+App.correction + App.transactionFee).toFixed(6);});
		$(".correction").each(function(){this.innerHTML = App.correction+ App.transactionFee});
		$(".maxSummToRegister").each(function(){this.innerHTML = (App.registrationPrices[2]+App.correction+ App.transactionFee).toFixed(6);});
		
		if (window.ethereum){
			if (ethereum.isMetaMask){
				$('#haveMetamask').show();
				$('#noMetamask').hide();

				$('#haveMetamask').off('click').on('click', async function(){

					Lobibox.notify('success', {
						pauseDelayOnHover: true,
						icon: 'bx bx-check',
						continueDelayOnInactiveTab: false,
						rounded: true,
						position: 'top center',
						msg: l100n.localize_string('pop-up')
					});
					alert(1);
		  		ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:App.mainChainId}]}).catch((_error)=>{

		  			if (_error != null) {
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
		  						alert(2);
		  						ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:App.mainChainId}]}).catch((_error)=>alert(_error));
		  				});
		  			}
		  		});
		  	});
			} else {
				$('#haveMetamask').hide();
				$('#noMetamask').show();			
			}
		}

		if (!jQuery.isEmptyObject(App.exchange)){
			$(".summInDollars").each(function(){this.innerHTML = ((App.registrationPrices[App.regMP]+App.correction+ App.transactionFee)*App.exchange['USD']).toFixed(2);});
			
		}
		let timer = setInterval(function(){
			if (counter == 4){
				clearInterval(timer);
				if (checkPass) {
					$("#checkPass").attr('id','check-pass')[0].innerHTML = l100n.localize_string('check-pass');
					$("#passDesc").attr('id','check-pass-text')[0].innerHTML = l100n.localize_string('check-pass-text');
					counter = 4;


							let price = (App.registrationPrices[App.regMP]+App.correction)*10**18;

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
				 				App.regMP, 
				 				App.roundId.toString(), 
				 				{from:App.account, value:price}
				 			)
				 			.then(()=>{
				 				window.location.assign('account.html');
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
								$("#reload").show();
				 			});

				} else {
					$("#checkPass").attr('id','check-fail')[0].innerHTML = l100n.localize_string('check-fail');
					$("#passDesc").attr('id','check-fail-text')[0].innerHTML = l100n.localize_string('check-fail-text');
					$("#reload").show();					
				}
			} else {

				let temp = Object.keys(App.steps)[counter];
				checkPass = checkPass && App.steps[temp];
				if (App.steps[temp]) {
					$("#"+temp+"Check")[0].innerHTML = '<i class="bx bx-check text-success font-24 pr-2"></i>';
				} else {
					$("#"+temp+"Check")[0].innerHTML = '<i class="bx bx-x text-danger font-24 pr-2"></i>';
					if (!cardShown) {
						if (temp == 'wallet') {
							if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
						    // For mobile
						    $("#"+temp+"MobileCard").addClass("show");
						  } else {
						    // For desktop
						    $("#"+temp+"Card").addClass("show");
							}

						} else {
							
							$("#"+temp+"Card").addClass("show");
						}
						
						cardShown = true;
					}					
				}
				counter++;
			}
		},300);

		

	},

  // Set a page to the defaul state
  setDefaults: function (){
  	// Set coin name
  	$(".crypto").each(function(){this.innerHTML = App.crypto});

  	// Set chain name
  	$(".chainName").each(function(){this.innerHTML = App.chainName});

  	// Set names of the marketing plans 
  	$(".mp0").each(function(){this.innerHTML = App.mp[0]});
  	$(".mp1").each(function(){this.innerHTML = App.mp[1]});
  	$(".mp2").each(function(){this.innerHTML = App.mp[2]});

  	$('#haveMetamask').hide();
		$('#noMetamask').show();

		$("#reload").hide();
		$("#reload").off('click').on('click',()=>{
			window.location.reload();
		});

  },

};

$(function () {
	"use strict"
	App.init().then(function () {

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
