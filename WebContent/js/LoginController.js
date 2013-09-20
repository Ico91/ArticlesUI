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
		$('#btnLogin').on('click', function(event) {
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

		ArticlesRequest.request('session/login', {
			method: 'POST',
			data: JSON.stringify(user),
			success: function(response) {
				sessionStorage.setItem("user", response);
				controller.userLoggedIn(response);
			},
			error: function(response) {
				var container = $('#loginForm');
				var error = $('#error');
				error.text("Wrong username or password.");
				container.append(error);
			}
		});
	}

}