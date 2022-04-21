let structurePageStrings={
	

	// Title of the page
	'browserPageTitle':{
		selector:"title",
		"en": "Crypto Freedome | Network",
		"ru": "Crypto Freedome | Партнерская сеть"
	},

	's-title-1':{
		selector:"#s-title-1",
		"en": 'Please wait. Network Structure is Loading from the Contract...',
		"ru": 'Пожалуйста подождите. Структура загружается из Контракта...'
	},
		
	'logo':{
		selector:".logo-text",
		"en": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome',
		"ru": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome'
	},

	's-title-2':{
		selector:"#s-title-2",
		"en": 'Network Structure',
		"ru": 'Партнерская сеть'
	},

	's-ref-p1':{
		selector:".referralCard #s-ref-p1",
		"en": 'Referral',
		"ru": 'Реферал'
	},	

	's-ref-d':{
		selector:".depth #title",
		"en": 'Depth',
		"ru": 'Глубина'
	},	

	's-noref':{
		selector:"#s-noref",
		"en": 'No referrals yet.',
		"ru": 'Рефералов пока нет.'
	},	

	's-ref-t1':{
		selector:".referralCard #referralsTooltip",
		attr: "data-original-title",
		"en": 'Number of referrals of the Partner',
		"ru": 'Количество Рефералов Партнера'
	},

	's-ref-t2':{
		selector:".referralCard #networkTooltip",
		attr: "data-original-title",
		"en": 'Total number of Partners in the Partner\'s Network',
		"ru": 'Общий размер сети Партнера'
	},
}

l100n.add_page("structurePage", structurePageStrings);