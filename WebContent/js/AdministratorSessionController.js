/** 
 * Controls the administration panel
 * @param context - the main controller
 * @returns
 */
function AdministratorSessionController(context) {
	var mainController = context;
	
	/**
	 * Load appropriate html
	 */
	this.init = function() {
		
		$('#container').load('administrator.html', function() {
			bind();
			$( "#tabs" ).tabs();
			var userController = new UserController();
			var statisticsController = new StatisticsController();
			userController.init();
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
	
	
};