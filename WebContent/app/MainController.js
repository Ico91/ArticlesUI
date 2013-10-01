/**
 * Manages communication between the UserSessionController and the
 * LoginController
 */
function MainController() {
	var controller = this;
	var DEFAULT_LANG = "en";
	
	/**
	 * Creates a new instance of the login controller
	 */
	this.init = function() {
		Messages.setLanguage(DEFAULT_LANG);
		
		if (sessionStorage.getItem("user") == null) {
			var loginController = new LoginController(controller);
			loginController.init();
		} else {
			var user = $.parseJSON(sessionStorage.getItem("user"));
			controller.userLoggedIn(user);
		}
	};
	
	function bind() {
		$('body').on('click', '.lang', function(event) {
			event.preventDefault();
			selectedIndex = $(this).parent().index();
			loadLanguageScript(selectedIndex);
		});
	}

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
			}
		});
	};

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