let messagesPageStrings={
	

	// Title of the page
	'browserPageTitle':{
		selector:"title",
		"en": "Crypto Freedome | Message History",
		"ru": "Crypto Freedome | История Сообщений"
	},
	
	'logo':{
		selector:".logo-text",
		"en": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome',
		"ru": '<span class="text-info">C</span>rypto&nbsp;<span class="text-warning">F</span>reedome'
	},

	'm-title-1':{
		selector:"#m-title-1",
		"en": 'Please wait. Message History is loading from the Contract...',
		"ru": 'Пожалуйста подождите. История Сообщений загружается из Контракта...'
	},

	'm-title-2':{
		selector:"#m-title-2",
		"en": 'Message History',
		"ru": 'История Сообщений'
	},
}

l100n.add_page("messagesePage", messagesPageStrings);