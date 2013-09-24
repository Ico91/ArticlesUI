/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	this.userController = userController;
	var controller = this;
	var detailsController = {};
	var statisticsController = {};
	var tabsContext = {};
	var userIdStatistics = {};
	var statisticsConfig = {
		url: 'statistics',
		container: '.userTabs .tabs-userStatistics #userStatistics'
	};
	
	this.statisticsElements = {
			element: "list-head-user"
		};
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		$('#userDetails').load('app/session/administrator/users/html/user_details.html', function() {
			tabsContext = $( "#userTabs" ).tabs({
				activate: function( event, ui ) {					
					if(ui.newPanel.selector == '#tabs-userStatistics' && userIdStatistics != null)
						ServerRequest.getScript("app/session/common/statistics/StatisticsController.js", statisticsInit);
				},
				create: function( event, ui ) {
					$(this).tabs('disable', 1);
				}
			});
			
			ServerRequest.getScript("app/session/administrator/users/js/DetailsController.js", detailsInit);
		});
	};
	
	function detailsInit() {
		detailsController = new DetailsController(controller);
		detailsController.init();
	}
	
	this.show = function(user) {
		if(user == null) {
			$(tabsContext).tabs('disable', 1).tabs('option', 'active', 0);
		}
		else {
			$(tabsContext).tabs('enable', 1);
			userIdStatistics = user.userId;
			ServerRequest.getScript("app/session/common/statistics/StatisticsController.js", statisticsInit);
		}
		detailsController.show(user);
	};
	
	this.userDeleted = function(user) {
		$(tabsContext).tabs('disable', 1).tabs('option', 'active', 0);
		detailsController.userDeleted(user);
	};
	
	this.onSave = function() {
		userController.onSave();
	};
	
	function statisticsInit() {
		statisticsController = new StatisticsController(controller);
		statisticsController.init(statisticsConfig.url + "/" + userIdStatistics, statisticsConfig.container);
	}
	
}