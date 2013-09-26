/**
 * Manages communication between the UserSessionController and the
 * LoginController
 */
function MainController() {
	var controller = this;

	/**
	 * Creates a new instance of the login controller
	 */
	this.init = function() {
		if (sessionStorage.getItem("user") == null) {
			var loginController = new LoginController(controller);
			loginController.init();
		} else {
			var user = $.parseJSON(sessionStorage.getItem("user"));
			controller.userLoggedIn(user);
		}

	};

	/**
	 * Invoked when the user successfully logs in
	 */
	this.userLoggedIn = function(user) {
		if (user.usertype == "ADMIN") {
			$('#references').load("app/session/administrator/references.html",
					administratorInit);
		} else {
			$('#references').load("app/session/user/references.html", userInit);
		}
	};

	/**
	 * Requesting a logout from the system. On success notifies the
	 * MainController to load the login form. Otherwise shows warning window for
	 * an occured error.
	 */
	this.logout = function() {
		sessionStorage.clear();
		ServerRequest.request('session/logout', {
			method : 'POST',
			success : function(response) {
				window.location.reload();
			},
			error : function(response) {
				showModal();
			}
		});
	};

	/**
	 * Displays a modal window warning the user for an occured error.
	 */
	function showModal() {
		var options = {
			window : {
				title : 'Error!',
				content : "<p>Please, log in the system again.</p>"
			},
			selector : '#articleDetails',
			buttons : buttons = {
				"Home" : function() {
					controller.init();
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}

	function administratorInit() {
		var adminSessionController = new AdministratorSessionController(
				controller);
		adminSessionController.init();
	}

	function userInit() {
		var userSessionController = new UserSessionController(controller);
		userSessionController.init();
	}
}