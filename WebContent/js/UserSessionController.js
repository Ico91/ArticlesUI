/**
 * @author Galina Hristova
 * @author Hristo
 * @param context
 * @returns
 */
function UserSessionController(context) {
	var mainController = context;
	
	/**
	 * Load articles form
	 */
	this.init = function() {
		$('#container').load('articles.html', function() {
			bind();
			var articlesController = new ArticlesController();
			articlesController.init();
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('body').on('click', '#btn-statistics', function(event) {
			event.preventDefault();
			var statisticsController = new StatisticsController();
			statisticsController.init();
		});
		
		$('body').on('click', '#btn-logout', function(event) {
			sessionStorage.clear();
			event.preventDefault();
			mainController.logout();
		});
	}
}
