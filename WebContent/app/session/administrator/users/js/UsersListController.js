/**
 * Controls the list of all users
 */

function UsersListController(context) {
	var paginationOptions = {
			selector: "#users-pages",
			url : "users/",
			listContainer : '.users',
			listElement : '.user',
		};
	var entityListController = {};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	this.init = function() {
		var controller = this;
		$('#usersList').load('app/session/administrator/users/html/users_list.html', function() {
			entityListController = new EntityListController(controller);
			var entityOptions = {
				id : 'userId',
				selectorClass : 'btn-user',
				property : 'username',
				btnDelete : 'btn-delete'
			};
			
			entityListController.init(paginationOptions, entityOptions);
		});
	};
	/**
	 * Invoked by the articles controller when saving an article.
	 */
	this.refresh = function() {
		entityListController.refresh(false);
	};
	
	/**
	 * Invoked by the entity list controller when deleting an article. 
	 */
	this.onDelete = function(article) {
		context.onDelete(article);
	};
	
	/**
	 * Invoked by the entity list controller when selecting an article.
	 */
	this.onSelect = function(article) {
		context.onSelect(article);
	};
	
	/**
	 * Invoked by the entity list controller when creating a new article.
	 */
	this.onNew = function() {
		context.onNew();
	};
	
	
	
	/**
	 * Provides options for the modal window when deleting an article.
	 */
	this.getModalDeleteOptions = function() {
		return {
			window : {
				title : 'Warning!',
				content : "Are you sure you want to delete this user?"
			},
			selector : '#userDetails',
		};
	};
};