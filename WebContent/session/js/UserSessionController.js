/** 
 * Controls the articles panel
 * @author Galina Hristova
 * @author Hristo
 * @param context
 * @returns
 */
function UserSessionController(mainController) {
	var statisticsController = new StatisticsController(this);
	var articlesController = new ArticlesController(this);
	
	/**
	 * Load articles form
	 */
	this.init = function() {
		$('#container').load('articles/html/articles.html', function() {
			bind();
			articlesController.init();
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('#btn-statistics').on('click', function(event) {
			event.preventDefault();
			statisticsController.init();
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
	}
	
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
}
