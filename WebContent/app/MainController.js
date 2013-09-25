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
			ServerRequest.getScript("app/login/LoginController.js", loginInit);
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
			ServerRequest.getScript("app/session/administrator/AdministratorSessionController.js", administratorInit);
		} else {
			ServerRequest.getScript("app/session/user/UserSessionController.js", userInit);
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
				// controller.init();
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
		var modalHtml = '<div id="dialog" title="Warning!"><p>Error has occurred.</p><p>Please, log in the system again.</p></div>';
		$('#articleDetails').append(modalHtml);
		$("#dialog").dialog({
			resizable : false,
			closeOnEscape : false,
			dialogClass : "no-close",
			draggable : true,
			hide : "explode",
			height : 300,
			width : 350,
			modal : true,
			buttons : buttons = {
				"Home" : function() {
					controller.init();
					$(this).dialog("close");
				}
			}
		});
	}
	
	function loginInit() {
		var loginController = new LoginController(controller);
		loginController.init();
	}
	
	function administratorInit() {
		var adminSessionController = new AdministratorSessionController(controller);
		adminSessionController.init();
	}
	
	function userInit() {
		var userSessionController = new UserSessionController(controller);
		userSessionController.init();
	}
}