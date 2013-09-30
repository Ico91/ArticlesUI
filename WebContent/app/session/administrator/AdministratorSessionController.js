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
		container: '#statistics',
		item : {
			username : 'Username',
			activityDate : 'Activity Date',
			userActivity : 'User Activity'
		},
		renderItem : function(item) {
			var username = '<span class="statistics-username">' + item.username + '</span>';
			var date = '<span class="statistics-date">' + item.activityDate + '</span>';
			var activity = '<span class="statistics-activity">' + item.userActivity + '</span>';
			
			return username + date + activity;
		}
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
						statisticsComponent.init(statisticsConfig);
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
			var logoutEnabled = userController.logoutEnabled();
			if(logoutEnabled.then != null)
			{
				logoutEnabled.then(function (answer) {
					if(answer)
						mainController.logout();
				});
			}
			else
				mainController.logout();
		});

	}
	
};