function MainController() {
	this.init = function() {
		var loginController = new LoginController(this);
		loginController.init();
	}

	this.userLoggedIn = function(user) {
		var userSessionController = new UserSessionController(this);
		userSessionController.init();
	}
}