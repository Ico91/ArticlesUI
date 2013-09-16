function UserController() {
	var usersListController = new UsersListController(this);
	var userDetailsController = new UserDetailsController(this);
	
	this.init = function() {
		usersListController.init();
		userDetailsController.init();
	};
	
	this.onNew = function() {
		userDetailsController.show(null);
	};
	
	this.onSelect = function(user) {
		userDetailsController.show(user);
	};
	
	this.onDelete = function(user) {
		userDetailsController.userDeleted(user);
	};
	
	this.onSave = function() {
		usersListController.refresh();
	};
}