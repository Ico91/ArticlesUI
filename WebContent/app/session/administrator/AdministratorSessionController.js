/** 
 * Controls the administration panel
 * @param context - the main controller
 * @returns
 */
function AdministratorSessionController(context) {
	var mainController = context;
	var adminContext = this;
	var userController = {};
	var statisticsController = {};
	var statisticsConfig = {
		url: 'statistics',
		container: '#statistics'
	};
	
	this.statisticsElements = {
			element: "list-head-admin"
		};
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		ServerRequest.getCss("app/session/administrator/users/css/user.css");
		ServerRequest.getCss("app/session/common/pagination/simplePagination.css");
		ServerRequest.getCss("app/session/common/statistics/statistics.css");
		$('#container').load('app/session/administrator/administrator.html', function() {
			bind();
			$( "#tabs" ).tabs({
				activate: function( event, ui ) {
					if(ui.newPanel.selector == '#tabs-statistics')
					{
						ServerRequest.getScript("app/session/common/statistics/StatisticsController.js", statisticsInit);
					}
					else
						statisticsController = null;
				}
			});
			ServerRequest.getScript("app/session/administrator/users/js/UserController.js", userInit);
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('body').on('click', '#btn-logout', function(event) {
			event.preventDefault();
			userController.onLogout(mainController.logout);
		});

	}
	
	function userInit() {
		userController = new UserController();
		userController.init();
	}
	
	function statisticsInit() {
		statisticsController = new StatisticsController(adminContext);
		statisticsController.init(statisticsConfig.url, statisticsConfig.container);
	}
};