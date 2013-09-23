/** 
 * Controls the administration panel
 * @param context - the main controller
 * @returns
 */
function AdministratorSessionController(context) {
	var mainController = context;
	var userController = new UserController();
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
		var adminContext = this;
		$('#container').load('session/html/administrator.html', function() {
			bind();
			$( "#tabs" ).tabs({
				activate: function( event, ui ) {
					if(ui.newPanel.selector == '#tabs-statistics')
					{
						statisticsController = new StatisticsController(adminContext);
						statisticsController.init(statisticsConfig.url, statisticsConfig.container);
					}
					if(ui.newPanel.selector != '#tabs-statistics')
						statisticsController = null;
				}
			});
			userController.init();
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