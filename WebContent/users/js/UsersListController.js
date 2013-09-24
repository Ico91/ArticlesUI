/**
 * Controls the list of all users
 */

function UsersListController(context) {
	var timeout = null;
	var usersList = [];
	var searchMode = false;
	var searchTerm = {};
	var paginationController = {};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	this.init = function() {
		var controller = this;
		$('#usersList').load('users/html/users_list.html', function() {
			bind();
			paginationController = new PaginationController(controller);
			paginationController.init({
				selector : "#users-pages",
				url : "users"
			});
		});
	};

	/**
	 * Invoked by the users controller when saving a user.
	 */
	this.refresh = function() {
		updateUsersList(false);
	};

	/**
	 * Visualizes the returned from the server users.
	 */
	this.show = function(response) {
		listUsers(response);
		$("#users").find("li:gt(0)").remove();
		var listElement = $('#users li.user');
		listElement.removeAttr('style');

		if (usersList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo('.users');
			return;
		}
		if (usersList instanceof Array) {
			for(var i = 0; i < usersList.length; i ++) {
				listElement.find('.btn-user').text(usersList[i].username);
				listElement.appendTo('#users');
				listElement = listElement.clone();
			}
		};
	};

	/**
	 * Invoked by the users controller when saving an user.
	 */
	function bind() {
		$('body').on('click', '.btnDelete', function(event) {
			event.preventDefault();
			showModal($(this).parent().index());
		});

		$('#btnNew').on('click', function(event) {
			event.preventDefault();
			context.onNew();
		});

		$('body').on('click', '.btn-user', function(event) {
			event.preventDefault();
			context.onSelect(usersList[$(this).parent().index()]);
		});

		// Handle keyup on search field
		// Make search only when search term is at least 3 symbols
		$('#search').on('keyup', function(event) {
			event.preventDefault();
			var input = $(this).val();
			if (timeout != null) {
				clearTimeout(timeout);
				// Make search when search field is empty to get all users
				if ($(this).val().length == 0) {
					searchMode = false;
					onSearch(input);
				} else if ($(this).val().length > 2) {
					searchMode = true;
					onSearch(input);
				}
			} else {
				if ($(this).val().length > 2) {
					searchMode = true;
					onSearch(input);
				}
			}
		});
	}

	/**
	 * Used to update the currently shown list of users, based on searching mode
	 * or normal viewing mode.
	 */
	function updateUsersList(fromFirstPage) {
		if (searchMode) {
			search(fromFirstPage);
		} else {
			paginationController.reload(fromFirstPage);
		}
	}

	/**
	 * If necessary, converts the returned users from the server to an array
	 * list.
	 */
	function listUsers(response) {
		usersList.length = 0;
		if (response.user != null) {
			if (response.user instanceof Array) {
				usersList = response.user;
			} else {
				usersList.push(response.user);
			}
		}
	}

	/**
	 * Invoked when typing in the search box.
	 */
	function onSearch(term) {
		searchTerm = term;
		timeout = setTimeout(search, 1000, true);
	}

	/**
	 * Sends a request to the server with the search term and parameters for
	 * corresponding users to get. On success shows the returned users.
	 */
	function search(fromFirstPage) {
		paginationController.reload(fromFirstPage, {
			data : {
				search : searchTerm
			}
		});
	};

	/**
	 * Displays a modal window asking the user to confirm the action.
	 * 
	 * @param index -
	 *            of the deleted user.
	 */
	function showModal(index) {
		var modalHtml = '<div id="dialog" title="Warning!">Are you sure you want to delete this user?</p></div>';
		$('#userDetails').append(modalHtml);
		$("#dialog").dialog({
			resizable : false,
			closeOnEscape : true,
			draggable : true,
			hide : "explode",
			height : 300,
			width : 350,
			modal : true,
			buttons : buttons = {
				"Delete" : function() {
					deleteUser(index, this);
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
	}

	/**
	 * Invoked when the user confirms the action. Sends a request to the server
	 * to delete the user.
	 * 
	 * @param index -
	 *            of the deleted user
	 * @param dialogContext -
	 *            modal window which invoked the operation.
	 */
	function deleteUser(index, dialogContext) {
		deletedUser = usersList[index];
		ServerRequest.request('users/' + indexToId(index), {
			method: 'DELETE',
			success: function(response) {
				updateUsersList(false);
				context.onDelete(deletedUser);
				$(dialogContext).dialog("close");
			},
			error: function(response) {
				alert('Cannot delete user!');
				console.log(response);
			}
		});
	};

	/**
	 * Gets the user's id corresponding to it's index in the list.
	 */
	function indexToId(index) {
		return usersList[index].userId;
	}

};