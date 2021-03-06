/**
 * Controls the login form
 * 
 * @param mainController
 * @returns
 */
function LoginController(mainController) {

	/**
	 * Load the login form
	 */
	this.init = function() {
		$("#container").load('app/login/login.html', function() {
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
		ServerRequest.request('session/login', {
			method: 'POST',
			data: JSON.stringify(user),
			success: function(response) {
				sessionStorage.setItem("user", JSON.stringify(response));
				mainController.userLoggedIn(response);
			}
		});
	}

}