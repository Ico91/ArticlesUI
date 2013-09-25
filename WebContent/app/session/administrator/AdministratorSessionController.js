/** 
 * Controls the administration panel
 * @param context - the main controller
 * @returns
 */
function AdministratorSessionController(context) {
	var mainController = context;
	var adminContext = this;
	var userController = {};
	var statisticsComponent = {};
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
		$('#container').load('app/session/administrator/administrator.html', function() {
			bind();
			$( "#tabs" ).tabs({
				activate: function( event, ui ) {
					if(ui.newPanel.selector == '#tabs-statistics')
					{
						statisticsComponent = new StatisticsComponent(adminContext);
						statisticsComponent.init(statisticsConfig.url, statisticsConfig.container);
					}
					else
						statisticsComponent = null;
				}
			});
			userController = new UserController();
			userController.init();
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
	
};