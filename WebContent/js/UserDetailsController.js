/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	this.userController = userController;
	var detailsController = new DetailsController(this);
	var statisticsController = new StatisticsController();
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		
		$('#userDetails').load('details.html', function() {
			$( "#userTabs" ).tabs();
			detailsController.init();
			statisticsController.init();
		});
	};
	
	this.show = function(user) {
		detailsController.show(user);
	};
	
	this.userDeleted = function(user) {
		detailsController.userDeleted(user);
	};
	
	this.onSave = function() {
		userController.onSave();
	};
	
}