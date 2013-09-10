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
			// TODO: error
			var url = "http://localhost:8080/ArticlesUI/unauthorized.html";    
			$(location).attr('href',url);
		});
	}
}
