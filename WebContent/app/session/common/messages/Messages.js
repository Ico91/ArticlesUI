var Messages = {

	language : "",
	
	messages : {},
	
	getMessage : function(key) {
		return this.messages[this.language][key];
	},
	
	setLanguage : function(lang) {
		this.language = lang;
		
		$.ajax({
			dataType : "json",
			url : "app/session/common/messages/languages/" + lang +".json",
			async : false,
			success : function(result) {
				Messages.messages[Messages.language] = result;
			}
		});
	}
};
