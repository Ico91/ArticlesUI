/**
 * Manages operations on the currently opened user.
 * @param userDetailsController - the context in which this controller works.
 */
function DetailsController(userDetailsController) {
	var currentUser = newUser();
	var userIdField = {};
	var usernameField = {};
	var passwordField = {};
	var userTypeField = {};
	var actionResult = {};
	this.userDetailsController = userDetailsController;

	/**
	 * Loads the necessary html contents.
	 */
	this.init = function() {
		$('#details').load('users/html/details.html', function() {
			bind();
		});
	};
	
	/**
	 * Shows the specified user.
	 * @param user - the user to display; 
	 * if null is passed, displays a new, empty user.
	 */
	this.show = function(user, callback) {
		// checks whether currently opened user is modified
		if(currentUser.username != usernameField.val() || currentUser.password != passwordField.val()
				|| currentUser.userType != userTypeField.val())
			showModal(user, callback);
		else {
			visualize(user);
			if(callback != null)
				callback();
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
		userIdField.text(currentUser.userId);
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
	function save(user, callback) {
		var dataToSend = {
			username : usernameField.val(),
			password : passwordField.val(),
			userType : userTypeField.val()
		};
		
		if(currentUser.userId != "") {
			ServerRequest.request('users/' + currentUser.userId, {
				method: 'POST',
				data: JSON.stringify(dataToSend),
				success: function(response) {
					userSaved(dataToSend, "update", callback);
					visualize(user);
				},
				error: function(response) {
					// TODO: create error flow
					console.log('Error updating user');
					console.log(response);
				}
			});
		}
		else {
			ServerRequest.request('users/', {
				method: 'PUT',
				data: JSON.stringify(dataToSend),
				success: function(response) {
					userSaved(response, "save", callback);
					visualize(user);
				},
				error: function(response) {
					// TODO: Create error flow
					console.log('Error saving user');
					console.log(response);
				}
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
	function userSaved(userData, action, callback) {
		if(action === "save")
			currentUser.userId = userData.userId;
		currentUser.username = userData.username;
		currentUser.password = userData.password;
		currentUser.userType = userData.userType;
		if(callback != null)
			callback();
		if(sessionStorage.getItem('user') != null) {
			userDetailsController.onSave();
		}
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
	function showModal(user, callback) {
		var modalHtml = '<div id="dialog" title="Warning!">Your currently opened user is modified!<p>Save changes?</p></div>';
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
					"Yes" : function() {
						save(user, callback);
						$(this).dialog("close");
					},
					"No": function() {
						visualize(user);
						if(callback != null)
							callback();
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	};
	
}