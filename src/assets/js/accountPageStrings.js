let accountPageStrings = {

	// Title of the page
	'browserPageTitle':{
		selector:"title",
		"en": "Crypto Freedome | Account",
		"ru": "Crypto Freedome | Аккаунт"
	},


	// Header


	'logo':{
		selector:".logo-text",
		"en": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome',
		"ru": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome'
	},

	//Partner info

	'partnerID':{
		selector:"#partnerID",
		"en": 'Partner ID',
		"ru": "ID партнера"
	},

	'notRegisteredBage':{
		selector:"#userId .badge-danger",
		"en": 'Not Registered',
		"ru": "Не Зарегистрирован"
	},

	'refLink0':{
		selector:"#refLink1",
		"en": 'Homepage referral link',
		"ru": "Ссылка на главную страницу"
	},

	'refLink1':{
		selector:"#refLink1",
		"en": 'Direct registration link',
		"ru": "Ссылка на регистрацию"
	},


	'refLink0-n':{
		selector:"#refLink1",
		"en": 'Referal link is copied to the clipboard.',
		"ru": "Реферальная ссылка скопирована в буфер обмена."
	},

	'refLink1-n':{
		selector:"#refLink1",
		"en": 'Direct registration referral link is copied to the clipboard.',
		"ru": "Реферальная ссылка на регистрацию скопирована в буфер обмена."
	},	

	//Wallet

	'wallet':{
		selector:"#wallet",
		"en": 'Wallet',
		"ru": "Кошелек"
	},

	'binanceLink0':{
		selector:"#binanceLink0",
		"en": 'Buy ',
		"ru": "Купить "
	},

	'binanceLink1':{
		selector:"#binanceLink1",
		"en": 'Sell ',
		"ru": "Продать "
	},

	'binanceLinkTail':{
		selector:".binanceLinkTail",
		"en": 'via Binance.com',
		"ru": "на Binance.com"
	},

	'binanceLinkFor':{
		selector:".binanceLinkFor",
		"en": 'for',
		"ru": "за"
	},

	// Notifications

	'a-mess-p1-1':{
		selector:"#a-mess-p1-1",
		"en": '',
		"ru": "Новых "
	},


	'a-mess-p1-2':{
		selector:"#a-mess-p1-2",
		"en": 'New',
		"ru": " "
	},

	'a-mess-p2-1':{
		selector:"#a-mess-p2-1",
		"en": 'Last ',
		"ru": "Последние "
	},


	'a-mess-p2-2':{
		selector:"#a-mess-p2-2",
		"en": 'Messages',
		"ru": "сообщений"
	},

	'msg-footer':{
		selector:".msg-footer",
		"en": 'View All Messages',
		"ru": "Просмотреть все сообщения"
	},	

	// Exchange rate

	'a-ex-p1':{
		selector:"#a-ex-p1",
		"en": 'Exchange Rate',
		"ru": 'Курс валюты'
	},

	// Menu

	'menu-1':{
		selector:"#menu-1",
		"en": 'Main',
		"ru": 'Главная'
	},

	'menu-2':{
		selector:"#menu-2",
		"en": 'Network',
		"ru": 'Партнерская Сеть'
	},

	'menu-3':{
		selector:"#menu-3",
		"en": 'Messages',
		"ru": 'Сообщения'
	},

	// Account section

	//Account details

	'a-title-1':{
		selector:"#a-title-1",
		"en": 'Please wait. Account Details is updating from the Contract...',
		"ru": 'Пожалуйста подождите. Детали Аккаунта обновляются...'
	},

	'a-title-2':{
		selector:"#a-title-2",
		"en": 'Account Details',
		"ru": 'Детали Аккаунта'
	},

	// Incomes

	'a-total-t1':{
		selector:"#a-total-t1",
		"attr": 'data-original-title',
		"en": 'Total income at the current exchange rate',
		"ru": 'Общий доход по текущему обменному курсу'
	},

	'a-total-t2':{
		selector:"#a-total-t2",
		"attr": 'data-original-title',
		"en": 'Direct income from Slots of all Levels of all Marketing Plans',
		"ru": 'Доход от Ваших Слотов всех видов и Уровней'
	},

	'a-total-t3':{
		selector:"#a-total-t3",
		"attr": 'data-original-title',
		"en": 'Income from actions of Partners in your Network till depth 6',
		"ru": 'Доход от Слотов, занятых Партнерами в Вашей сети от 2 до 6 глубины'
	},

	'a-total-t4':{
		selector:"#a-total-t4",
		"attr": 'data-original-title',
		"en": 'Missed income due to low Level or unactivated Bonus plans',
		"ru": 'Упущеный доход из-за низкого Уровня или неактивный Бонусных планов'
	},
	
	'a-total-p1':{
		selector:"#a-total-p1",
		"en": 'Total income',
		"ru": 'Общий доход'
	},

	'a-total-p2':{
		selector:"#a-total-p2",
		"en": 'Direct income',
		"ru": 'Прямой доход'
	},

	'a-total-p3':{
		selector:"#a-total-p3",
		"en": 'Network income',
		"ru": 'Сетевой доход'
	},

	'a-total-p4':{
		selector:"#a-total-p4",
		"en": 'Missed income',
		"ru": 'Упущеный доход'
	},

	// Levels

	'a-level-t1':{
		selector:"#a-level-t1",
		"attr": 'data-original-title',
		"en": 'Your current Levels in all Marketing plans',
		"ru": 'Текущие уровни всех Маркетинговых планов'
	},

	'a-level-p1':{
		selector:"#a-level-p1",
		"en": 'Current Levels',
		"ru": 'Текущие уровни'
	},

	'a-ex-upd':{
		selector:".a-ex-upd",
		"en": 'Exchange Rate Update in',
		"ru": 'Обновление курса через'
	},

	'a-ex-upd-s':{
		selector:".a-ex-upd-s",
		"en": 's',
		"ru": ' сек.'
	},

	'lightMaxLevelText':{
		selector:"#lightMaxLevelText",
		"en": 'Maximum',
		"ru": 'Максимальный'
	},

	'fastMaxLevelText':{
		selector:"#fastMaxLevelText",
		"en": 'Maximum',
		"ru": 'Максимальный'
	},

	'vipMaxLevelText':{
		selector:"#vipMaxLevelText",
		"en": 'Maximum',
		"ru": 'Максимальный'
	},

	'levelUpText':{
		selector:".levelUpText:not(.activation)",
		"en": 'Level Up',
		"ru": 'Поднять'
	},
		
	'levelUpFastText':{
		selector:".levelUpFastText:not(.activation)",
		"en": 'Level Up',
		"ru": 'Поднять'
	},
		
	'levelUpVipText':{
		selector:".levelUpVipText:not(.activation)",
		"en": 'Level Up',
		"ru": 'Поднять'
	},
		
	'levelUpFastTextA':{
		selector:".levelUpFastText.activation",
		"en": 'Activate',
		"ru": 'Начать&nbsp;&nbsp;'
	},
		
	'levelUpVipTextA':{
		selector:".levelUpVipText.activation",
		"en": 'Activate',
		"ru": 'Начать&nbsp;&nbsp;'
	},	

	'a-modal-reg-b1':{
		selector:".registrationText:not(.activation)",
		"en": 'Registration',
		"ru": 'Регистрация'
	},	 

	'a-modal-reg-b2':{
		selector:".registrationText.activation",
		"en": 'Activation',
		"ru": 'Активация'
	},	

	'a-modal-reg-w1':{
		selector:".waiting",
		"en": '<span class="spinner-border spinner-border-sm font-10 mr-2" role="status"><span class="sr-only">Loading...</span></span> Waiting...',
		"ru": '<span class="spinner-border spinner-border-sm font-10 mr-2" role="status"><span class="sr-only">Loading...</span></span> Ждем...'
	},		

	'a-modal-no':{
		selector:".modal-footer .btn-light",
		"en": 'Close',
		"ru": 'Закрыть'
	},	

	'a-modal-levelup':{
		selector:"#modalLevelUpBtn",
		"en": 'Level Up',
		"ru": 'Поднять Уровень'
	},	

	'a-levelup':{
		selector:".a-levelup",
		"en": 'Confirm the transaction at the Wallet!<br>Account Details will update automatically after confirmation from ',
		"ru": 'Подтвердите транзакцию в Кошельке!<br>Детали Аккаунта обновятся автоматически после подтверждения от '
	},

	'a-reg':{
		selector:".a-reg",
		"en": 'Confirm the transaction at the Wallet!<br>You will be redirected to the personal account automatically after confirmation from ',
		"ru": 'Подтвердите транзакцию в Кошельке!<br> Вы будете перенаправлены в персональный аккаунт автоматически после подтверждения от '
	},

	// Referrals

	'a-ref-t1':{
		selector:"#a-ref-t1",
		"attr": 'data-original-title',
		"en": 'Number of personally invited Partners',
		"ru": 'Число лично приглашенных Партнеров'
	},

	'a-ref-p1':{
		selector:"#a-ref-p1",
		"en": 'Referrals',
		"ru": 'Рефералы'
	},

	// Network

	'a-net-t1':{
		selector:"#a-net-t1",
		"attr": 'data-original-title',
		"en": 'The total number of Partners in your network',
		"ru": 'Общее число Партнеров в Вашей сети'
	},

	'a-net-p1':{
		selector:"#a-net-p1",
		"en": 'Network',
		"ru": 'Сеть'
	},

	// Basic Income Progress

	'a-top-t1':{
		selector:".a-top-t1",
		"attr": 'data-original-title',
		"en": '<h6>A Basic Income for members!</h6><p>It is collected as a 5% fee from each transaction and miss Network Bonuses until it reaches the required amount.</p><p>All Partners who meet the condition are paid the same amount.</p><p>Once paid, collection starts over.</p>',
		"ru": '<h6>Базовый Доход для участников!</h6><p>Он собирается из 5% отчислений с каждой транзакции и всех упущеных Доходов от сети пока не будет набрана необхоимая сумма.</p><p>Всем выполнившим условие Партнерам выплачивается одинаковая сумма.</p><p>После выплаты сбор начинается снова.</p>'
	},

	'a-top-p1':{
		selector:".a-top-p1",
		"en": 'Basic Income',
		"ru": 'Базовый Доход'
	},

	'a-top-p2':{
		selector:"#a-top-p2",
		"en": 'Next payment collection',
		"ru": 'Сбор следующей выплаты'
	},

	'a-top-x1':{
		selector:"#a-top-x1",
		"en": 'You get Basic Income!',
		"ru": 'Вы получаете Базовый Доход!'
	},


	'a-top-x2':{
		selector:"#a-top-x2",
		"en": 'Up ',
		"ru": 'Для получения нужен '
	},

	'a-top-x3':{
		selector:"#a-top-x3",
		"en": ' to the Level ',
		"ru": ' уровня '
	},

	'a-top-x4':{
		selector:"#a-top-x4",
		"en": ', invite ',
		"ru": ', пригласите '
	},

	'a-top-x5':{
		selector:"#a-top-x5",
		"en": 'Invite ',
		"ru": 'Пригласите '
	},

	'a-top-x6':{
		selector:"#a-top-x6",
		"en": ' to get it.',
		"ru": '.'
	},

	'a-top-x7':{
		selector:"#a-top-x7",
		"en": 'Data is loading...',
		"ru": 'Данные загружаются...'
	},

	// Pools

	'a-pools':{
		selector:"#a-pools",
		"en": 'Active Steps',
		"ru": 'Активные Ступени'
	},

	// Level card tooltips

	// Slots 
	'a-slotsTooltip-p1':{
		selector:"#a-slotsTooltip-p1",
		"en": 'Total number of ',
		"ru": 'Общее число Слотов '
	},  

	'a-slotsTooltip-p2':{
		selector:"#a-slotsTooltip-p2",
		"en": ' Slots taken by partners at the Level',
		"ru": ', занаятое партнерами на Уровне'
	},

	// Price
	'a-priceTooltip-p1':{
		selector:"#a-priceTooltip-p1",
		"en": 'Current price of the ',
		"ru": 'Текущая стоимость Слота '
	},  

	'a-priceTooltip-p2':{
		selector:"#a-priceTooltip-p2",
		"en": ' Slot at this Level',
		"ru": ' на этом Уровне'
	},

	// Reopens	
	'a-reopensTooltip-p1':{
		selector:"#a-reopensTooltip-p1",
		"en": 'Number of auto-renewals of the ',
		"ru": 'Число пвторных открытий Ступени '
	},  

	'a-reopensTooltip-p2':{
		selector:"#a-reopensTooltip-p2",
		"en": ' Pool at the Level',
		"ru": ' на Уровне'
	},

	// Level up 	
	'a-levelup-p1':{
		selector:"#a-levelup-p1",
		"en": 'Full cost of all Slots for the next Level of ',
		"ru": 'Полная стоимость всех Слотов до следущего Уровня '
	},  

	'a-levelup-p2':{
		selector:"#a-levelup-p2",
		"en": ' ',
		"ru": ' '
	},

	// Level
	'a-level':{
		selector:".a-level",
		"en": 'Level',
		"ru": 'Уровень'
	},

	// Warnings
	'a-levelWarning-d-p1':{
		selector:"#a-levelWarning-d-p1",
		"en": '',
		"ru": 'Закончились Слоты '
	},  

	'a-levelWarning-d-p2':{
		selector:"#a-levelWarning-d-p2",
		"en": '  Slots of the Level are exhausted. Level Up to prevent miss out on income.',
		"ru": ' на этом Уровне. Поднимите Уровень, чтоб не упустить доход.'
	},	

	'a-levelWarning-w-p1':{
		selector:"#a-levelWarning-w-p1",
		"en": '',
		"ru": 'Заканчиваются Слоты '
	},  

	'a-levelWarning-w-p2':{
		selector:"#a-levelWarning-w-p2",
		"en": '  Slots of the Level are running out. Level Up to prevent miss out on income.',
		"ru": ' на этом Уровне. Поднимите Уровень, чтоб не упустить доход.'
	},

};

let registerPageStrings = {


	// Title
	'reg-title':{
		selector:"#reg-title",
		"en": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome Registration',
		"ru": 'Регистрация <span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome'
	},

	// Subtitle
	'reg-sub':{
		selector:"#reg-sub",
		"en": 'Select the appropriate Step. Higher Steps can be activated at any time.<br>Missed incomes are <span class="text-warning">non-refundable</span>.',
		"ru": 'Выберите подходящую Ступень.<br>Ступени более высокого уровня могут быть активированы в любое время.<br>Упущеный доход <span class="text-warning">не возмещается</span>.'
	},

	// Registration button
	'reg-register':{
		selector:".reg-register",
		"en": 'Registration',
		"ru": 'Регистрация'
	},

	// Exchange rate update
	'reg-exch-upd':{
		selector:".reg-exch-upd",
		"en": 'exchange rate will be updated in',
		"ru": 'курс обмена обновится через'
	},

	'reg-exch-upd-s':{
		selector:".reg-exch-upd-s",
		"en": 's',
		"ru": 'с'
	},

	// Price description
	'reg-price-desc-p1':{
		selector:".price-desc span",
		"en": '/lifeteme',
		"ru": '/бессрочно'
	},	
	
	'reg-price-desc-t1':{
		selector:".price-desc",
		attr:"data-original-title",
		"en": '<p>Registration for an unlimited period and does not require repeated investments.</p><p>The registration price is fixed in USD and is adjusted according to the current exchange rate of the contract currency.</p>',
		"ru": '<p>Регистрация на неограниченный период и не требует дополнительных вложений.</p><p>Цена регистрации зафиксирована в USD и обновляется по текущему обменному курсу валюты Контракта.</p>'
	},	

	// Basic marketing plan description
	'reg-plan-d1':{
		selector:"#reg-plan-d1",
		"en": 'Easy to Start only eith Direct Income',
		"ru": 'Легкий старт только с Прямым Доходом'
	},	

	// Fast marketing plan description
	'reg-plan-d2':{
		selector:"#reg-plan-d2",
		"en": 'Direct and basic Network Incomes',
		"ru": 'Прямой и Базовый Сетевой Доходы'
	},	

	// VIP marketing plan description
	'reg-plan-d3':{
		selector:"#reg-plan-d3",
		"en": 'Direct, maximum Network and passive Basic Incomes',
		"ru": 'Максимальные Прямой, Сетевой и Базовый Доходы'
	},	

	// Pools
	'reg-p1':{
		selector:".reg-p1",
		"en": '3 Slots',
		"ru": '3 Слота'
	},

	'reg-p1-1':{
		selector:".reg-p1-1",
		"en": 'Two auto-renewals ',
		"ru": 'Два автообновления '
	},	

	'reg-p2':{
		selector:".reg-p2",
		"en": 'Level 1 for',
		"ru": 'Уровня 1 за'
	},

	'reg-p3':{
		selector:".reg-p3",
		"en": 'Level 1',
		"ru": 'Уровня 1'
	},	

	// Direct bonuses
	'reg-p4':{
		selector:".reg-p4",
		"en": 'Get 75% from Level 1',
		"ru": 'Получает 75% от Слотов'
	},

	'reg-p5':{
		selector:".reg-p5",
		"en": 'Miss income from Level 1',
		"ru": 'Упускает доход от Слотов'
	},	

	'reg-p6':{
		selector:".reg-p6",
		"en": 'Slots',
		"ru": 'Уровня 1'
	},	

	'reg-direct-t1':{
		selector:".reg-direct-t1",
		attr: "data-original-title",
		"en": 'Income from your Slots taken by Partners',
		"ru": 'Доход от Ваших Слотов, занятых Партнерами'
	},

	'reg-direct-p1':{
		selector:".reg-direct-p1",
		"en": 'Direct Income',
		"ru": 'Прямой Доход'
	},

	// Bonus calculation

	'reg-calc-t1':{
		selector:".reg-calc-t1",
		attr: "data-original-title",
		"en": '<p>Income from <span class="text-warning">ONLY 9 Closed Slots</span> on each level up to the current one.</p><p>Possible additional taken slots in lower Levels Pools are <b>NOT UNCLUDED</b> and can rise a final summ.</p><p>The real sum can be different due to exchange rate at the moment.</p><p>All leveling costs are included.</p> ',
		"ru": '<p>Доход <span class="text-warning">ТОЛЬКО от первых 9 закрытых Слотов</span> на всех уровнях до указанного включительно.</p><p>Возможные доходы от закрытия дополнительных Слотов <b>НЕ ВКЛЮЧЕНЫ</b> и реальнный доход может быть больше расчетного.</p><p>Фактическая сумма может отличаться из-за колебаний обменного курса.</p><p><span class="text-earning">Все расходы включены</span> в расчет.</p>'
	},	

	'reg-calc-p1':{
		selector:".reg-calc-p1",
		"en": 'Direct Income Calculation',
		"ru": 'Расчет Прямого Дохода'
	},	

	// Network bonuses

	'reg-net-t1':{
		selector:".reg-net-t1",
		attr: "data-original-title",
		"en": 'Income from Slots taken by Partners in your Network',
		"ru": 'Доход от Слотов, занятых Партнерами в Вашей сети'
	},	

	'reg-net-p1':{
		selector:".reg-net-p1",
		"en": 'Network Income',
		"ru": 'Сетевой доход'
	},	

	'reg-net-p2':{
		selector:".reg-net-p2",
		"en": 'Miss Income',
		"ru": 'Упускает доход'
	},	

	'reg-net-p3':{
		selector:".reg-net-p3",
		"en": 'from <b>Any</b> type of Slot at Depth of',
		"ru": 'от <b>Любых</b> Слотов на глубине'
	},

	'reg-net-p4':{
		selector:".reg-net-p4",
		"en": 'Get Only',
		"ru": 'Получает только'
	},

	'reg-net-p5':{
		selector:".reg-net-p5",
		"en": 'Get',
		"ru": 'Получает'
	},	

	// Top Leader bonuses

	'reg-top-p1':{
		selector:".reg-top-p1",
		"en": 'Basic Income',
		"ru": 'Базовый Доход'
	},

	'reg-top-p2':{
		selector:".reg-top-p2",
		"en": 'Not Avaible',
		"ru": 'Не доступен'
	},	

	'reg-top-p3':{
		selector:".reg-top-p3",
		"en": 'Next Basic Income Payment is ',
		"ru": 'Сумма следующей выплаты: '
	},

	'reg-top-p4':{
		selector:".reg-top-p4",
		"en": 'Available from Level',
		"ru": 'Доступен с Уровня'
	},
};

let modalsPageStrings = {

	// Registration 

	'modal-p1':{
		selector:".modal-p1",
		"en": 'notice',
		"ru": ' '
	},

	'modal-p2':{
		selector:".modal-p2",
		"en": 'of the',
		"ru": ' '
	},

	'modal-p3':{
		selector:".modal-p3",
		"en": 'includes:',
		"ru": 'включает в себя:'
	},

	'modal-p4':{
		selector:".modal-p4",
		"en": '3 Slots',
		"ru": '3 Слота'
	},

	'modal-p5':{
		selector:".modal-p5",
		"en": 'price is',
		"ru": 'стоит'
	},

	'modal-p6':{
		selector:".modal-p6",
		"en": 'By clicking the ',
		"ru": 'Нажимая кнопку "'
	},

	'modal-p7':{
		selector:".modal-p7",
		"en": ' button you confirm that you clearly understand and agree with the terms below.',
		"ru": '", Вы подтверждаете, что четко понимаете и соглашаетесть с условиями ниже.'
	},

	'modal-p8':{
		selector:".modal-p8",
		"en": 'The website at the address on the Internet',
		"ru": 'Веб-сайт по адресу в сети Интернет '
	},

	'modal-p9':{
		selector:".modal-p9",
		"en": ', hereinafter referred to as the Website, is only an interface for the smart contract in the blockchain',
		"ru": ', дале именуемый Веб-сайт, является только интерфейсом для работы со смарт-контрактом в сети блокчейн'
	},

	'modal-p10':{
		selector:".modal-p10",
		"en": ', hereinafter the Blockchain, at the address',
		"ru": ', далее именуемой Блокчейн, расположенным по адресу'
	},

	'modal-p11':{
		selector:".modal-p11",
		"en": ', hereinafter referred to as the Contract.',
		"ru": ', далее именуемым Контракт.'
	},

	'modal-p12':{
		selector:".modal-p12",
		"en": 'The Website does not conduct any digital asset transactions on its own. The Website only displays information and calls external, in relation to the Website, applications and software products to carry out the actions requested by the user. All digital asset exchange and transfer operations take place between an application external to the Website or a browser extension to access your cryptocurrency Wallet, Contract and Blockchain.',
		"ru": 'Веб-сайт не производит никаких операций с цифровыми активами самостоятельно. Веб-сайт осуществляет только вывод информации и вызов внешних, по отношению к Веб-сайту, приложений и программных продуктов для осуществления запрашиваемых пользователем действий. Все операции по обмену и передаче цифровых активов выполняются между приложением, внешним по отношению к Веб-сайту, или расширением браузера для доступа к вашему кошельку криптовалюты, Контракту и Блокчейну.'
	},

	'modal-p13':{
		selector:".modal-p13",
		"en": 'The Website does not store, request or use in any form (open or closed) any information about personal data, private keys, mnemonic phrases and other confidential data and cannot be directly or indirectly responsible for its safety and risks of loss, in any case, including but not limited to spam, account hacking, identity theft, virus attack, fraudulent or criminal activity (including real, suspected, probable or suspected fraud / crime).',
		"ru": 'Веб-сайт не хранит, не запрашивает и не использует в любой форме (открытой или закрытой) какую-либо информацию о личных данных, закрытых ключах, мнемонических фразах и других конфиденциальных данных и в любом случае не может нести прямую или косвенную ответственность за ее безопасность и риски потери, включая, помимо прочего, спам, взлом учетных записей, кражу личных данных, вирусные атаки, мошенническую или преступную деятельность (включая реальное, предполагаемое, вероятное или предполагаемое мошенничество / преступление).'
	},

	'modal-p14':{
		selector:".modal-p14",
		"en": 'You use the Website and any information published on it at your own risk and risk and that the services are provided "as is" and "as available" without warranties of any kind, express or implied, which are not expressly stated in the official documentation.',
		"ru": 'Вы используете Веб-сайт и любую опубликованную на нем информацию на свой страх и риск и рискуете, что услуги предоставляются «как есть» и «как доступны» без каких-либо гарантий, явных или подразумеваемых, которые прямо не указаны в официальной документации.'
	},

	'modal-p15':{
		selector:".modal-p15",
		"en": 'Any advice or information received from members registered on the Website or third parties, received orally, in writing or in any other form, does not create any guarantees that are not expressly indicated in the official documentation.',
		"ru": 'Любые советы или информация, полученные от участников, зарегистрированных на Веб-айте, или третьих лиц, полученные устно, письменно или в любой другой форме, не создают никаких гарантий, которые прямо не указаны в официальной документации.'
	},

	'modal-p16':{
		selector:".modal-p16",
		"en": 'You, your partners and any third parties agree to release the Owner of the domain name and resources of the Website, as well as the Administrators and other service personnel, hereinafter referred to as the Personnel, from liability to you or any third party for any direct or indirect damage arising under any circumstances, including but not limited to indirect, special, incidental or consequential damages or other damages (including damages from loss of business, loss of profits, lost savings, business interruption or the like) arising from the use of the Website, information published on it, partner sites or external links, technical malfunctions of the site, errors of the Contract or Blockchain..',
		"ru": 'Вы, ваши партнеры и любые третьи стороны соглашаетесь освободить Владельца доменного имени и ресурсов Веб-сайта, а также Администраторов и другой обслуживающий персонал, далее именуемый Персоналом, от ответственности перед вами или любой третьей стороной за любые прямой или косвенный ущерб, возникающий при любых обстоятельствах, включая, помимо прочего, косвенные, особые, случайные или косвенные убытки или другие убытки (включая убытки от потери бизнеса, упущенной выгоды, упущенных сбережений, прерывания бизнеса и т. д.), возникающих в результате использования Веб-сайта, опубликованной на нем информации, партнерских сайтов или внешних ссылок, технических неисправностей Веб-сайта, ошибок  Контракта или Блокчейна.'
	},

	'modal-p17':{
		selector:".modal-p17",
		"en": 'The Personnel will not be held liable based on any theory of liability, including breach of contract, breach of warranty, trespass (including negligence), product liability or otherwise, even if you or your representative have been informed by the Personnel of the possibility of such damage or loss.',
		"ru": 'Персонал не будет нести ответственности на основании какой-либо теории ответственности, включая нарушение контракта, нарушение гарантии, вторжение (включая халатность), ответственность за качество продукции или иное, даже если вы или ваш представитель были проинформированы Персоналом о возможности такого ущерба или потери.'
	},

};
 
l100n.add_page("accountPage", accountPageStrings);
l100n.add_page("registerPage", registerPageStrings);
l100n.add_page("modalsPage", modalsPageStrings);