/**
 * Controls the login form
 * 
 * @param mainController
 * @returns
 */
function LoginController(mainController) {
	var controller = mainController;

	/**
	 * Load the login form
	 */
	this.init = function() {
		$("#container").load('login.html', function() {
			bind();
		});
	};

	/**
	 * Add listeners to the buttons
	 */
	function bind() {
		$('#login-btn').on('click', function(event) {
			event.preventDefault();
			login();
		});
	}

	/**
	 * Sending information to the server for a user that tries to login. On
	 * success returns the result to the MainController. Otherwise shows an
	 * error.
	 */
	function login() {
		var user = {
			username : $("#input-username").val(),
			password : $("#input-password").val(),
		};

		request(
				'session/login',
				'POST',
				JSON.stringify(user),
				"application/json; charset=utf-8",
				function(result) {
					sessionStorage.setItem("user", result);
					controller.userLoggedIn(result);
				},
				function() {
					var container = $('#container');
					var error = '<p class="error">Wrong username or password</p>';
					container.append(error);
				});
	}

}