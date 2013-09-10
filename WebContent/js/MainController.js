/**
 * Manages communication between the UserSessionController and the LoginController
 */
function MainController() {
	/**
	 * Creates a new instance of the login controller
	 */
	this.init = function() {
		var loginController = new LoginController(this);
		loginController.init();
	};

	/**
	 * Invoked when the user successfully logs in
	 */
	this.userLoggedIn = function(user) {
		var userSessionController = new UserSessionController(this);
		userSessionController.init();
	};
}