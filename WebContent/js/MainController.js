/**
 * Manages communication between the UserSessionController and the LoginController
 */
function MainController() {
	var controller = this;
	/**
	 * Creates a new instance of the login controller
	 */
	this.init = function() {
		if(sessionStorage.getItem("user") == null) {
			var loginController = new LoginController(this);
			loginController.init();
		}
		else {
			var userSessionController = new UserSessionController(this);
			userSessionController.init();
		}
	};

	/**
	 * Invoked when the user successfully logs in
	 */
	this.userLoggedIn = function(user) {	
		if (user.usertype == "ADMIN") {
			var administratorSessionController = new AdministratorSessionController(this);
			administratorSessionController.init();
		} else {
			var userSessionController = new UserSessionController(this);
			userSessionController.init();
		}
	};
	
	/**
	 * Requesting a logout from the system. On success notifies the
	 * MainController to load the login form. Otherwise shows warning window for
	 * an occured error.
	 */
	this.logout = function() {
		sessionStorage.clear();
		request('session/logout', 'POST', null, null, function(result) {
			controller.init();
		}, function(result) {
			showModal();
		});
	};
	
	function showModal() {
		var modalHtml = '<div id="dialog" title="Warning!"><p>Error has occurred.</p><p>Please, log in the system again.</p></div>';
		$('#articleDetails').append(modalHtml);
		$( "#dialog" ).dialog({
			resizable: false,
			closeOnEscape: false,
			dialogClass: "no-close",
			draggable: true,
			hide: "explode",
			height:300,
			width: 350,
			modal: true,
			buttons: buttons = {
					"Home" : function() {
						controller.init();
						$(this).dialog("close");
					}
			}
		});
	}
}