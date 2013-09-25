/** 
 * Controls the articles panel
 * @author Galina Hristova
 * @author Hristo
 * @param context
 * @returns
 */
function UserSessionController(mainController) {
	var controller = this;
	var statisticsController = {};
	var articlesController = {};
	var statisticsConfig = {
		url: 'session/statistics',
		container: '#userStatistics'
	};
	
	this.statisticsElements = {
		element: "list-head-user"
	};
	
	/**
	 * Load articles form
	 */
	this.init = function() {
		ServerRequest.getCss("app/session/user/articles/css/articles.css");
		ServerRequest.getCss("app/session/common/pagination/simplePagination.css");
		ServerRequest.getCss("app/session/common/statistics/statistics.css");
		$('#container').load('app/session/user/articles/html/articles.html', function() {
			bind();
			ServerRequest.getScript("app/session/user/articles/js/ArticlesController.js", articlesInit);
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('#btn-statistics').on('click', function(event) {
			event.preventDefault();
			ServerRequest.getScript("app/session/common/statistics/StatisticsController.js", statisticsInit);
			showModal();
		});
		
		$('#btn-logout').on('click', function(event) {
			event.preventDefault();
			articlesController.onLogout(mainController.logout);			
		});

		$('.darken').on('click', function() {
			closeModal();
		});
		
		$('.btn-close').on('click', function(event) {
			event.preventDefault();
			closeModal();
		});
		
		$('.darken').hide();
	};
	
	function showModal() {
		$('.darken').show();
		$('#statisticsModal').show();
		$('.darken').animate({
			opacity : 1
		}, 500);
		$('#statisticsModal').animate({
			opacity : 1
		}, 500);
	}

	/**
	 * Close the modal window
	 */
	function closeModal() {
		$('#statisticsModal').animate({
			opacity: 0
		}, 500, function() {
			$(this).hide();
		});
		$('.darken').animate({
			opacity: 0
		}, 500, function() {
			$(this).hide();
		});
	};
	
	function articlesInit() {
		articlesController = new ArticlesController(controller);
		articlesController.init();
	}
	
	function statisticsInit() {
		statisticsController = new StatisticsController(controller);
		statisticsController.init(statisticsConfig.url, statisticsConfig.container);
	}
}
