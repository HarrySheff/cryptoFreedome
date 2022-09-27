
/* For a localization of erros are used 2 options
 * For loczlize string - used in scripts to add <span> tags for continius language switches
 * Common - for normal language switches 
 */

// Set errors strings 
let errorPageStrings = {

	// Default error

	// For localize string
	'err-default-h':{
		selector:"#err-default-h",
		"en": '<span id="err-default-h">Something wrong</span>',
		"ru": '<span id="err-default-h">Что-то не так</span>'
	},	

	'err-default-p':{
		selector:"#err-default-p",
		"en": '<span id="err-default-p">We are currently working hard on this page. Try reload it.</span>',
		"ru": '<span id="err-default-p">Мы уже работаем над этой страницей. Попробуйте перезагрузить ее.</span>'
	},	

	// Common
	'err-default-hl':{
		selector:"#err-default-h",
		"en": 'Something wrong.',
		"ru": 'Что-то не так.'
	},	

	'err-default-pl':{
		selector:"#err-default-p",
		"en": 'We are currently working hard on this page. Try reload it.',
		"ru": 'Мы уже работаем над этой страницей. Попробуйте перезагрузить ее.'
	},	

	// Loading 

	// For localize string
	'err-load-h':{
		selector:"#err-load-h",
		"en": '<span id="err-load-h">Loading...</span>',
		"ru": '<span id="err-load-h">Загрузка...</span>'
	},	

	'err-load-p':{
		selector:"#err-load-p",
		"en": '<span id="err-load-p">Waiting for the application loading.</span>',
		"ru": '<span id="err-load-p">Ожидаем загрузки приложения.</span>'
	},

	// Common
	'err-load-hl':{
		selector:"#err-load-h",
		"en": 'Loading...',
		"ru": 'Загрузка...'
	},	

	'err-load-pl':{
		selector:"#err-load-p",
		"en": 'Waiting for the application loading.',
		"ru": 'Ожидаем загрузки приложения.'
	},

	// Wallet connection error

	// For localize string
	'err-wallet-h':{
		selector:"#err-wallet-h",
		"en": '<span id="err-wallet-h">The Wallet is Dissconnected</span>',
		"ru": '<span id="err-wallet-h">Кошелек не подключен.</span>'
	},	

	'err-wallet-p':{
		selector:"#err-wallet-p",
		"en": '<span id="err-wallet-p">Plaese connect to the Wallet and choose </span>',
		"ru": '<span id="err-wallet-p">Пожалйста, подключитесь к Кошельку и выберите сеть </span>'
	},		

	// Common
	'err-wallet-hl':{
		selector:"#err-wallet-h",
		"en": 'The Wallet is Dissconnected',
		"ru": 'Кошелек не подключен.'
	},	

	'err-wallet-pl':{
		selector:"#err-wallet-p",
		"en": 'Plaese connect to the Wallet and choose ',
		"ru": 'Пожалйста, подключитесь к Кошельку и выберите сеть '
	},

	// Log in

	// For localize string
	'err-login-h':{
		selector:"#err-login-h",
		"en": '<span id="err-login-h">Login to the Wallet...</span>',
		"ru": '<span id="err-login-h">Подключаемся к Кошельку...</span>'
	},	

	'err-login-p':{
		selector:"#err-login-p",
		"en": '<span id="err-login-p">If you are not logged in, please log in and allow the Wallet to access the website.</span>',
		"ru": '<span id="err-login-p">Если Вы не авторизовались, пожалуйста авторизуйтесь и разрешите Кошельку доступ к сайту.</span>'
	},		

	// Common
	'err-login-hl':{
		selector:"#err-login-h",
		"en": 'Login to the Wallet...',
		"ru": 'Подключаемся к Кошельку...'
	},	

	'err-login-pl':{
		selector:"#err-login-p",
		"en": 'If you are not logged in, please log in and allow the Wallet to access the website.',
		"ru": 'Если Вы не авторизовались, пожалуйста авторизуйтесь и разрешите Кошельку доступ к сайту.'
	},

	// Access denied

	// For localize string
	'err-access-h':{
		selector:"#err-access-h",
		"en": '<span id="err-access-h">Access denied.</span>',
		"ru": '<span id="err-access-h">Доступ запрещен.</span>'
	},	

	'err-access-p':{
		selector:"#err-access-p",
		"en": '<span id="err-access-p">Plaese allow the Crypto Freedom access to the Wallet.</span>',
		"ru": '<span id="err-access-p">Пожалуйста, разрешите Crypto Freedom доступ к Кошельку.</span>'
	},		

	// Common
	'err-access-hl':{
		selector:"#err-access-h",
		"en": 'Access denied.',
		"ru": 'Доступ запрещен.'
	},	

	'err-access-pl':{
		selector:"#err-access-p",
		"en": 'Plaese allow the Crypto Freedom access to the Wallet.',
		"ru": 'Пожалуйста, разрешите Crypto Freedom доступ к Кошельку.'
	},	

	// Chain problem

	// For localize string
	'err-chprob-h':{
		selector:"#err-chprob-h",
		"en": '<span id="err-chprob-h">Chain connection problem.</span>',
		"ru": '<span id="err-chprob-h">Проблема доступа к сети блокчейн.</span>'
	},	

	'err-chprob-p':{
		selector:"#err-chprob-p",
		"en": '<span id="err-chprob-p">Plaese check if the Wallet connected to </span>',
		"ru": '<span id="err-chprob-p">Пожалуйста, проверьте, что Кошелек подключен к </span>'
	},		

	// Common
	'err-chprob-hl':{
		selector:"#err-chprob-h",
		"en": 'Chain connection problem.',
		"ru": 'Проблема доступа к сети блокчейн.'
	},	

	'err-chprob-pl':{
		selector:"#err-chprob-p",
		"en": 'Plaese check if the Wallet connected to ',
		"ru": 'Пожалуйста, проверьте, что Кошелек подключен к '
	},		

	// Wrong chain MetaMask

	// For localize string
	'err-wrongM-h':{
		selector:"#err-wrongM-h",
		"en": '<span id="err-wrongM-h">Connected to the wrong chain.</span>',
		"ru": '<span id="err-wrongM-h">Подключены к другой сети.</span>'
	},	

	'err-wrongM-p1':{
		selector:"#err-wrongM-p",
		"en": '<span id="err-wrongM-p1">Please use the </span><a class="text-info" id = "chainSwithcLink" style="cursor:pointer;">',
		"ru": '<span id="err-wrongM-p1">Пожалуйста, используйте  ссылку </span><a class="text-info" id = "chainSwithcLink" style="cursor:pointer;">'
	},		

	'err-wrongM-p2':{
		selector:"#err-wrongM-p2",
		"en": '</a><span id="err-wrongM-p2"> link to swith on it fast. Also, You can do it manually in MetaMask.</span>',
		"ru": '</a><span id="err-wrongM-p2"> для быстрого переключения сети.<br>Вы можете переклчить сеть самостоятельно в MetaMask.</span>'
	},

	// Common
	'err-wrongM-hl':{
		selector:"#err-wrongM-h",
		"en": 'Connected to the wrong chain.',
		"ru": 'Подключены к другой сети.'
	},	

	'err-wrongM-p1l':{
		selector:"#err-wrongM-p1",
		"en": 'Please use the <a class="text-info" id = "chainSwithcLink" style="cursor:pointer;">',
		"ru": 'Пожалуйста, используйте  ссылку <a class="text-info" id = "chainSwithcLink" style="cursor:pointer;">'
	},		

	'err-wrongM-p2l':{
		selector:"#err-wrongM-p2",
		"en": '</a> link to swith on it fast. Also, You can do it manually in MetaMask.',
		"ru": '</a> для быстрого переключения сети.<br>Вы можете переклчить сеть самостоятельно в MetaMask.'
	},

	// Wrong chain 

	// For localize string
	'err-wrong-h':{
		selector:"#err-wrong-h",
		"en": '<span id="err-wrong-h">Connected to the wrong chain.</span>',
		"ru": '<span id="err-wrong-h">Подключены к другой сети.</span>'
	},	

	'err-wrong-p1':{
		selector:"#err-wrong-p",
		"en": '<span id="err-wrong-p1">Please connect to the </span>',
		"ru": '<span id="err-wrong-p1">Пожалуйста, подключитесь к </span>'
	},		

	'err-wrong-p2':{
		selector:"#err-wrong-p2",
		"en": '<span id="err-wrong-p2"> in the Wallet.</span>',
		"ru": '<span id="err-wrong-p2"> в Кошельке.</span>'
	},	

	// Common
	'err-wrong-hl':{
		selector:"#err-wrong-h",
		"en": 'Connected to the wrong chain.',
		"ru": 'Подключены к другой сети.'
	},	

	'err-wrong-p1l':{
		selector:"#err-wrong-p",
		"en": 'Please connect to the ',
		"ru": 'Пожалуйста, подключитесь к '
	},		

	'err-wrong-p2l':{
		selector:"#err-wrong-p2",
		"en": ' in the Wallet.',
		"ru": ' в Кошельке.'
	},	

	// No wallet 

	// For localize string
	'err-nowallet-h':{
		selector:"#err-nowallet-h",
		"en": '<span id="err-nowallet-h">No Wallet detected.</span>',
		"ru": '<span id="err-nowallet-h">Кошелек не обнаружен.</span>'
	},	

	'err-nowallet-p':{
		selector:"#err-nowallet-p",
		"en": '<span id="err-nowallet-p">Please install <a href="metamask.io" target="_blank" class="text-info" style="cursor:pointer;">the MetaMask Wallet</a> and connect to it.</span>',
		"ru": '<span id="err-nowallet-p">Пожалуйста установите <a href="metamask.io" target="_blank" class="text-info" style="cursor:pointer;">Кошелек MetaMask</a> и подклчитесь к нему.</span>'
	},

	// Common
	'err-nowallet-hl':{
		selector:"#err-nowallet-h",
		"en": 'No Wallet detected.',
		"ru": 'Кошелек не обнаружен.'
	},	

	'err-nowallet-pl':{
		selector:"#err-nowallet-p",
		"en": 'Please install <a href="metamask.io" target="_blank" class="text-info" style="cursor:pointer;">the MetaMask Wallet</a> and connect to it.',
		"ru": 'Пожалуйста установите <a href="metamask.io" target="_blank" class="text-info" style="cursor:pointer;">Кошелек MetaMask</a> и подклчитесь к нему.'
	},

	// Initiating the Contract 

	// For localize string
	'err-init-h':{
		selector:"#err-init-h",
		"en": '<span id="err-init-h">Initiating the Contract...</span>',
		"ru": '<span id="err-init-h">Инициализация Контракта...</span>'
	},	

	'err-init-p':{
		selector:"#err-init-p",
		"en": '<span id="err-init-p">Waiting for the Contract data.</span>',
		"ru": '<span id="err-init-p">Ожидаем данные от Контракта.</span>'
	},			

	// Common
	'err-init-hl':{
		selector:"#err-init-h",
		"en": 'Initiating the Contract...',
		"ru": 'Инициализация Контракта...'
	},	

	'err-init-pl':{
		selector:"#err-init-p",
		"en": 'Waiting for the Contract data.',
		"ru": 'Ожидаем данные от Контракта.'
	},			

	// No account access

	// For localize string
	'err-acc-h':{
		selector:"#err-acc-h",
		"en": '<span id="err-acc-h">No access to the account.</span>',
		"ru": '<span id="err-acc-h">Нет доступа к Аккаунту.</span>'
	},	

	'err-acc-p':{
		selector:"#err-acc-p",
		"en": '<span id="err-acc-p">Please check if You are logged in the Walet and reload the page.</span>',
		"ru": '<span id="err-acc-p">Пожалуйста, проверьте авторизацию в Кошельке и презагрузите страницу.</span>'
	},

	// Common
	'err-acc-hl':{
		selector:"#err-acc-h",
		"en": 'No access to the account.',
		"ru": 'Нет доступа к Аккаунту.'
	},	

	'err-acc-pl':{
		selector:"#err-acc-p",
		"en": 'Please check if You are logged in the Walet and reload the page.',
		"ru": 'Пожалуйста, проверьте авторизацию в Кошельке и презагрузите страницу.'
	},

	// Contract not found

	// For localize string
	'err-nofound-h':{
		selector:"#err-nofound-h",
		"en": 'Contract not found.',
		"ru": 'Контракт не найден.'
	},	

	// Common
	'err-nofound-h':{
		selector:"#err-nofound-h",
		"en": 'Contract not found.',
		"ru": 'Контракт не найден.'
	},	
};

// Add strings to the loclization object
l100n.add_page("errorPage", errorPageStrings);