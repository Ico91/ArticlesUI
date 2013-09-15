function AdministratorSessionController(context) {
	var mainController = context;
	
	this.init = function() {
		
		$('#container').load('administrator.html', function() {
			bind();
			$( "#tabs" ).tabs();
			//var userController = new UserController();
			var statisticsController = new StatisticsController();
			//userController.init();
			statisticsController.init();
		});
	};
	
	function bind() {
		$('body').on('click', '#btn-logout', function(event) {
			event.preventDefault();
			mainController.logout();
		});
	}
	
	
};