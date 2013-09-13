/**
 * Manages communication between the UserSessionController and the LoginController
 */
function MainController() {
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
		var userSessionController = new UserSessionController(this);
		var administratorSessionController = new AdministratorSessionController(this);
		if (user.usertype == "ADMIN") {
			administratorSessionController.init();
		} else {
			userSessionController.init();
		}
	};
}