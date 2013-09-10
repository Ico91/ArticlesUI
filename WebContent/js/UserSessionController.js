function UserSessionController(context) {
	var mainController = context;
	
	this.init = function() {
		$('#container').load('articles.html', function() {
			bind();
			var articlesController = new ArticlesController();
			articlesController.init();
		});
	};
	
	function bind() {
		$('body').on('click', '#btn-statistics', function(event) {
			event.preventDefault();
			var statisticsController = new StatisticsController();
			statisticsController.init();
		});
		
		$('body').on('click', '#btn-logout', function(event) {
			event.preventDefault();
			logout();
		});
	}
	

	function logout() {
		request('users/logout', 'POST', null, null, function(result) {
			mainController.init();
		}, function(result) {
			showModal();
		});
	}
	
	function showModal() {
		var modalHtml = '<div id="dialog" title="Warning!"><p>Error has occurred.</p><p>Please, log in the system again.</p></div>';
		$('#articleDetails').append(modalHtml);
		$( "#dialog" ).dialog({
			resizable: false,
			closeOnEscape: false,
			dialogClass: "no-close",
			draggable: true,
			hide: "explode",
			height:300,
			width: 350,
			modal: true,
			buttons: buttons = {
					"Home" : function() {
						mainController.init();
						$(this).dialog("close");
					}
			}
		});
	}
}
