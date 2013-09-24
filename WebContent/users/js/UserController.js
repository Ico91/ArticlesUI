/**
 * Manages communication between the UserDetailsController and the UsersListController
 */

function UserController() {
	var usersListController = new UsersListController(this);
	var userDetailsController = new UserDetailsController(this);
	
	/**
	 * Loads the necessary html contents
	 */
	this.init = function() {
		usersListController.init();
		userDetailsController.init();
	};
	
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
	
	/**
	 * Invoked when pressing the logout button, tells the user details controller
	 * to clear the fields, thus checking for a not saved user.
	 */
	this.onLogout = function(callback) {
		userDetailsController.show(null, callback);
	};
}