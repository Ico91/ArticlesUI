/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	this.userController = userController;
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		
		$('#userDetails').load('details.html', function() {
			bind();
			$( "#userTabs" ).tabs();
			var detailsController = new DetailsController();
			var statisticsController = new StatisticsController();
			detailsController.init();
			statisticsController.init();
		});
	};
	
	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('body').on('click', '#btn-logout', function(event) {
			event.preventDefault();
			mainController.logout();
		});
	}
	
}