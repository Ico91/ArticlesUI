/**
 * Manages operations on the currently opened user.
 * 
 * @param userDetailsController -
 *            the context in which this controller works.
 */
function DetailsController(userDetailsController) {
	var currentUser = newUser();
	var userIdField = {};
	var usernameField = {};
	var passwordField = {};
	var userTypeField = {};
	this.userDetailsController = userDetailsController;

	/**
	 * Loads the necessary html contents.
	 */
	this.init = function() {
		$('#details').load('app/session/administrator/users/html/details.html',
				function() {
					bind();
				});
	};

	/**
	 * Shows the specified user.
	 * 
	 * @param user -
	 *            the user to display; if null is passed, displays a new, empty
	 *            user.
	 */
	this.show = function(user) {
		visualize(user);
	};

	/**
	 * Checks if the deleted user is the one currently shown and if true shows a
	 * new empty user.
	 */
	this.userDeleted = function(user) {
		if (currentUser.userId === user.userId) {
			visualize(null);
		}
	};
	
	/**
	 * Whether the currently opened user is modified.
	 */
	this.userModified = function() {
		if(currentUser.username != usernameField.val() ||
			currentUser.password != passwordField.val() ||
			currentUser.userType != userTypeField.val())
			return true;
		return false;
	};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	function bind() {
		userIdField = $('#userID');
		usernameField = $('#username');
		passwordField = $('#password');
		userTypeField = $('#types');
		$('#btnSave').click(function(event) {
			event.preventDefault();
			save(currentUser);
		});
	}

	/**
	 * Displays the specified user in the appropriate text fields.
	 * 
	 * @param user -
	 *            the user to display
	 */
	function visualize(user) {
		if (user != null)
			currentUser = user;
		else
			currentUser = newUser();
		userIdField.text(currentUser.userId);
		usernameField.val(currentUser.username);
		passwordField.val(currentUser.password);
		userTypeField.val(currentUser.userType);
	}

	/**
	 * Sends the appropriate request to the server for saving the currently
	 * opened user.
	 * 
	 * @param user -
	 *            the user to be saved
	 */
	function save() {
		if (!validateFields()) {
			return;
		}
		var dataToSend = {
			username : usernameField.val(),
			password : passwordField.val(),
			userType : userTypeField.val()
		};

		if (currentUser.userId != "") {
			ServerRequest.request('users/' + currentUser.userId, {
				method : 'POST',
				data : JSON.stringify(dataToSend),
				success : function(response) {
					userSaved(dataToSend, "POST");
				}
			});
		} else {
			ServerRequest.request('users/', {
				method : 'PUT',
				data : JSON.stringify(dataToSend),
				success : function(response) {
					userSaved(response, "PUT");
				}
			});
		}
		;
	}
	;

	/**
	 * Set that the currently opened user is the saved one.
	 * 
	 * @param userData -
	 *            the user that has been saved
	 * @param method -
	 *            if the action is to save a new user or update an existing.
	 */
	function userSaved(userData, action) {
		if (action === "PUT")
			currentUser.userId = userData.userId;
		currentUser.username = userData.username;
		currentUser.password = userData.password;
		currentUser.userType = userData.userType;
		userDetailsController.onSave();
	}

	/**
	 * Validates the user text fields, returning false if they are empty.
	 * 
	 * @returns {Boolean}
	 */
	function validateFields() {
		if (usernameField.val() == "") {
			alert('Username field is empty!');
			return false;
		} else if (passwordField.val() == "") {
			alert('Password field is empty');
			return false;
		} else
			return true;
	}

	/**
	 * @returns Returns a new copy of empty user.
	 */
	function newUser() {
		return {
			userId : "",
			username : "",
			password : "",
			userType : "ADMIN"
		};
	}
}