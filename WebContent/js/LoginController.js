function LoginController(mainController) {
	var controller = mainController;

	this.init = function() {
		$("#container").load('login.html', function() {
			bind();
		});
	};

	function bind() {
		$('#login-btn').on('click', function(event) {
			event.preventDefault();
			login();
		});
	}

	function login() {
		var user = {
			username : $("#username").val(),
			password : $("#password").val(),
		};
		
		request('users/login', 'POST',  JSON.stringify(user), "application/json; charset=utf-8", function(result) {
			controller.userLoggedIn(result);
		}, function() {
				var container = $('#container');
				var error = '<p class="error">Wrong username or password</p>';
				container.append(error);
			}
		);
	}

}