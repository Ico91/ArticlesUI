/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	this.userController = userController;
	var controller = this;
	var detailsController = {};
	var statisticsComponent = {};
	var tabsContext = {};
	var userIdStatistics = {};
	var statisticsConfig = {
		url: 'statistics',
		container: '.userTabs .tabs-userStatistics #userStatistics',
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
	 * Load appropriate html
	 */
	this.init = function() {
		$('#userDetails').load('app/session/administrator/users/html/user_details.html', function() {
			tabsContext = $( "#userTabs" ).tabs({
				activate: function( event, ui ) {					
					if(ui.newPanel.selector == '#tabs-userStatistics' && userIdStatistics != null)
						statisticsConfig.url = 'statistics/' + userIdStatistics;
						statisticsComponent = new StatisticsComponent(controller);
						statisticsComponent.init(statisticsConfig);
				},
				create: function( event, ui ) {
					$(this).tabs('disable', 1);
				}
			});
			
			detailsController = new DetailsController(controller);
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
			statisticsConfig.url = 'statistics/' + userIdStatistics;
			statisticsComponent = new StatisticsComponent(controller);
			statisticsComponent.init(statisticsConfig);
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
	
	this.userModified = function() {
		return detailsController.userModified();
	}
	
}