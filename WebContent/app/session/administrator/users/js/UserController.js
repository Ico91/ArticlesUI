/**
 * Manages communication between the UserDetailsController and the UsersListController
 */

function UserController() {
	var usersListController = {};
	var userDetailsController = {};
	
	/**
	 * Loads the necessary html contents
	 */
	this.init = function() {
		usersListController =  new UsersListController(this);
		usersListController.init();
		userDetailsController = new UserDetailsController(this);
		userDetailsController.init();
	};
	
	/**
	 * Invoked when creating a new user, tells the UserDetailsController to show it.
	 */
	this.onNew = function() {
		show(null);
	};
	
	/**
	 * Invoked on selection an user from the list, tells the UserDetailsController to show it
	 */
	this.onSelect = function(user) {
		show(user);
	};
	
	/**
	 * Invoked when deleting an user from the list, tells the UserDetailsController to update the contents
	 */
	this.onDelete = function(user) {
		userDetailsController.userDeleted(user);
	};
	
	/**
	 * Invoked when saving an user, tells the UsersListController to update the list.
	 */
	this.onSave = function() {
		usersListController.refresh();
	};

	/**
	 * Invoked when pressing the logout button, tells the user details controller
	 * to clear the fields, thus checking for a not saved user.
	 */
	this.logoutEnabled = function() {
		if(userDetailsController.userModified())
			return confirm();
		return true;
	};
	
	function show(user) {
		if(userDetailsController.userModified())
		{
			confirm().then(function (answer){
				if(answer)
					userDetailsController.show(user);
			});
		}
		else
			userDetailsController.show(user);
	}
	
	function confirm() {
		var defer = $.Deferred();
		showModal(defer);
		return defer.promise();
	}
	
	/**
	 * Displays a modal window asking the user for appropriate actions.
	 */
	function showModal(defer) {
		var options = {
			window : {
				title : 'Warning!',
				content : "Your currently opened user is modified! Do you want to continue without saving?"
			},
			selector : '.content',
			buttons : buttons = {
				"Yes" : function() {
					defer.resolve(true);
					$(this).dialog("close");
				},
				"No" : function() {
					defer.resolve(false);
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}
}