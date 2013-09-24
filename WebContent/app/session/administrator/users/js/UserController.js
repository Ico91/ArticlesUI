/**
 * Manages communication between the UserDetailsController and the UsersListController
 */

function UserController() {
	var controller = this;
	var usersListController = {};
	var userDetailsController = {};
	
	/**
	 * Loads the necessary html contents
	 */
	this.init = function() {
		ServerRequest.getScript("app/session/administrator/users/js/UsersListController.js", usersListInit);
		ServerRequest.getScript("app/session/administrator/users/js/UserDetailsController.js", userDetailsInit);
	};
	
	function usersListInit() {
		usersListController =  new UsersListController(controller);
		usersListController.init();
	}
	
	function userDetailsInit() {
		userDetailsController = new UserDetailsController(controller);
		userDetailsController.init();
	}
	
	/**
	 * Invoked when creating a new user, tells the UserDetailsController to show it.
	 */
	this.onNew = function() {
		userDetailsController.show(null);
	};
	
	/**
	 * Invoked on selection an user from the list, tells the UserDetailsController to show it
	 */
	this.onSelect = function(user) {
		userDetailsController.show(user);
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
}