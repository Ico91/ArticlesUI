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
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		$('#userDetails').load('details.html', function() {
			tabsContext = $( "#userTabs" ).tabs({
				activate: function( event, ui ) {
					if(ui.newPanel.selector == '#tabs-userStatistics' && userIdStatistics != null)
						statisticsController.init(userIdStatistics);
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
			console.log(tabsContext);
			$(tabsContext).tabs('enable', 1);
			userIdStatistics = user.userId;
			statisticsController.init(user.userId); 
		}
		detailsController.show(user);
	};
	
	this.userDeleted = function(user) {
		detailsController.userDeleted(user);
	};
	
	this.onSave = function() {
		userController.onSave();
	};
	
}