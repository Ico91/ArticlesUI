/** 
 * Controls the articles panel
 * @author Galina Hristova
 * @author Hristo
 * @param context
 * @returns
 */
function UserSessionController(mainController) {
	var controller = this;
	var statisticsComponent = {};
	var articlesController = {};
	var statisticsConfig = {
		url: 'session/statistics',
		container: '#userStatistics',
		item : {
			activityDate : 'Activity Date',
			userActivity : 'User Activity'
		},
		renderItem : function(item) {
			var date = '<span class="statistics-date">' + item.activityDate + '</span>';
			var activity = '<span class="statistics-activity">' + item.userActivity + '</span>';
			
			return date + activity;
		}
	};
	
	this.statisticsElements = {
		element: "list-head-user"
	};
	
	/**
	 * Load articles form
	 */
	this.init = function() {
		$('#container').load('app/session/user/articles/html/articles.html', function() {
			bind();
			articlesController = new ArticlesController(controller);
			articlesController.init();
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('#btn-statistics').on('click', function(event) {
			event.preventDefault();
			statisticsComponent = new StatisticsComponent(controller);
			statisticsComponent.init(statisticsConfig);
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
}
