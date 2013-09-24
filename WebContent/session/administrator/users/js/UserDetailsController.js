/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	this.userController = userController;
	var detailsController = new DetailsController(this);
	var statisticsController = new StatisticsController(this);
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
		$('#userDetails').load('session/administrator/users/html/user_details.html', function() {
			tabsContext = $( "#userTabs" ).tabs({
				activate: function( event, ui ) {					
					if(ui.newPanel.selector == '#tabs-userStatistics' && userIdStatistics != null)
						statisticsController.init(statisticsConfig.url + "/" + userIdStatistics, statisticsConfig.container);
				},
				create: function( event, ui ) {
					$(this).tabs('disable', 1);
				}
			});
			detailsController.init();
		});
	};
	
	this.show = function(user) {
		if(user == null) {
			$(tabsContext).tabs('disable', 1).tabs('option', 'active', 0);
		}
		else {
			$(tabsContext).tabs('enable', 1);
			userIdStatistics = user.userId;
			statisticsController.init(statisticsConfig.url + "/" + userIdStatistics, statisticsConfig.container); 
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
	
}