/**
 * Manages operations on the currently opened user.
 * @param userController - the context in which this controller works.
 */
function UserDetailsController(userController) {
	var currentUser = newUser();
	var userIdField = {};
	var usernameField = {};
	var passwordField = {};
	var userTypeField = {};
	var actionResult = {};
	this.userController = userController;

	/**
	 * Loads the necessary html contents.
	 */
	this.init = function() {
		$('#userDetails').load('user_details.html', function() {
			bind();
		});
	};
	
	/**
	 * Shows the specified user.
	 * @param user - the user to display; 
	 * if null is passed, displays a new, empty user.
	 */
	this.show = function(user) {
		// checks whether currently opened user is modified
		if(currentUser.username != usernameField.val() || currentUser.password != passwordField.val()
				|| currentUser.userType != userTypeField.val())
			showModal(user);
		else {
			visualize(user);
		}
	};
	
	/**
	 * Checks if the deleted user is the one currently shown and if true
	 * shows a new empty user.
	 */
	this.userDeleted = function(user) {
		if(currentUser.userId === user.userId) {
			visualize(null);
		}
	};
	
	/**
	 * Displays the specified user in the appropriate text fields.
	 * @param user - the user to display
	 */
	function visualize(user) {
		if(user != null)
			currentUser = user;
		else 
			currentUser = newUser();
		userIdField.val(currentUser.userId);
		usernameField.val(currentUser.username);
		passwordField.val(currentUser.password);
		userTypeField.val(currentUser.userType);
	}
	
	/**
	 * Binds the necessary functions to the relevant controls
	 */
	function bind() {
		userIdField = $('#userID');
		usernameField = $('#username');
		passwordField = $('#password');
		userTypeField = $('#types');
	
		actionResult = $('#action-result');
		actionResult.hide();
		$('#btnSave').click(function(event) {
			event.preventDefault();
			if(!validateFields()) {
				return;
			}
			save(currentUser);
		});
	}
	
	/**
	 * Sends the appropriate request to the server for saving the currently opened user. 
	 * @param user - the user to be saved
	 */
	function save(user) {
		var dataToSend = {
			username : usernameField.val(),
			password : passwordField.val(),
			userType : userTypeField.val()
		};
		
		if(currentUser.userId != "") {
			request('users/' + currentUser.userId, 'POST', JSON.stringify(dataToSend), "application/json; charset=utf-8", function(response) {
				userSaved(dataToSend, "update", true);
				visualize(user);
			},
			function(response) {
				// TODO: create error flow
				notificateUser("update", false);
				console.log('Error updating user');
				console.log(response);
			});
		}
		else {
			request('users/', 'PUT', JSON.stringify(dataToSend), "application/json; charset=utf-8", function(response) {
				userSaved(response, "save", true);
				visualize(user);
			},
			function(response) {
				// TODO: Create error flow
				notificateUser("save", false);
				console.log('Error saving user');
				console.log(response);
			});
		};
	};
	
	/**
	 * Set that the currently opened user is the saved one. 
	 * @param userData - the user that has been saved
	 * @param action - if the action is to save a new user or
	 * update an existing.
	 * @param result
	 */
	function userSaved(userData, action, result) {
		if(action === "save")
			currentUser.userId = userData.userId;
		currentUser.username = userData.username;
		currentUser.password = userData.password;
		currentUser.userType = userData.userType;
		notificateUser(action, result);
		userController.onSave();
	}

	/**
	 * Validates the user text fields, returning false if they are empty.
	 * @returns {Boolean}
	 */
	function validateFields() {
		if(usernameField.val() == "") {
			alert('Username field is empty!');
			return false;
		}
		else if(passwordField.val() == "") {
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
	
	/**
	 * Displays a modal window asking the user for appropriate actions.
	 * @param user
	 */
	function showModal(user) {
		var modalHtml = '<div id="dialog" title="Warning!">Your currently opened user is modified!<p>Do you want to continue without saving?</p></div>';
		$('#userDetails').append(modalHtml);
		$( "#dialog" ).dialog({
			resizable: false,
			closeOnEscape: true,
			draggable: true,
			hide: "explode",
			height:300,
			width: 350,
			modal: true,
			buttons: buttons = {
					"Save" : function() {
						save(user);
						$(this).dialog("close");
					},
					"Continue": function() {
						visualize(user);
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	};
	
	/**
	 * Displays a message to the user, indicating the result of the last action.
	 * @param action
	 * @param result
	 */
	function notificateUser(action, result) {
		actionResult.css('opacity', 1);
		actionResult.show('slow');
		if(action === "save") {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.text('User saved successfully!');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.text('User could not be saved!');
			}
		}
		else {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.text('User updated successfully!');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.text('User could not be updated!');
			}
		}

		
		actionResult.animate({
			opacity: 0,
			height: "toggle"
		}, 2500);
	}
	
}