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
  nextLevelPrice: [0, 0, 0],
  registrationBlock: 0,
  currentBlock:0,
	sponsorId: 1,
	mp:['Light', 'Smart', 'Prime'],
	registrationPrices: [],
	roundId: 0,
	steps: {'wallet':false, 'chain':false, 'contract':false, 'balance':false},
	commission: 0.006,

	// An app initiaion
  init:  async function() {

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
			  App.web3Provider = window.web3.currentProvider;
			  
			  let temp = await web3.eth.getAccounts();
				App.account = temp[0];

		}	


		App.web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
		
		web3 = new Web3(App.web3Provider);		

		web3.eth.getBlockNumber(function(err, result){ 

			App.currentBlock = result;

			console.log('--- Web3 initiated ---');
			
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

			window.location.assign('account.html'+window.location.search);

		} else {

			await App.loadRegistrationPrices();

	 		console.log('--- Contract Data loaded ---');

	 		if (App.steps['wallet'] && App.balance >= App.registrationPrices[0] + App.commission){
	 			
	 			App.renderPass('balance');
	 		} 

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

	renderPass: function (step){

		App.steps[step] = true;
	},

	render: function (){

		$(".mp0Price").each(function(){
			this.innerHTML = App.registrationPrices[0].toFixed(6);
		})
		let cardShown =false;
		let checkPass = true;
		let counter = 0;
		$("#minimumSummToRegister")[0].innerHTML = (App.registrationPrices[0]+App.commission).toFixed(6);
		$(".commission").each(function(){this.innerHTML = App.commission});

		let timer = setInterval(function(){
			if (counter == 4){
				clearInterval(timer);
				if (checkPass) {
					$("#checkPass")[0].innerHTML = 'Check passed!'
					$("#passDesc")[0].innerHTML = ' Redirecting to the Registation in <span id="timer">5</span>s';
					counter = 4;
					setInterval(function(){
						if (counter == 0) {
							window.location.assign('account.html'+window.location.search);
						} else {
							$("#timer")[0].innerHTML = counter;
							counter--;
						}
					},1000);
				} else {
					$("#checkPass")[0].innerHTML = 'Check fail.'
					$("#passDesc")[0].innerHTML = 'Follow instructions and try agan.';					
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
						    // код для мобильных устройств
						    $("#"+temp+"MobileCard").addClass("show");
						  } else {
						    // код для обычных устройств
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

  }
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
