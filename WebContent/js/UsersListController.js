/**
 * Controls the list of all users
 */

function UsersListController(mainController) {
	var timeout = null;
	var usersList = [];
	var searchMode = false;
	var searchTerm = {
		term : null,
		page : 0
	};
	var currentPage = 1;
	var usersPerPage = 10;
	var pagesContext = {};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	this.init = function() {
		$('#usersList').load('users_list.html', function() {
			bind();
			loadUsers();
		});
	};

	/**
	 * Invoked by the users controller when saving an user.
	 */
	function bind() {
		$('body').on('click', '.btnDelete', function(event) {
			event.preventDefault();
			showModal($(this).parent().index() - 1);
		});

		$('#btnNew').on('click', function(event) {
			event.preventDefault();
			mainController.onNew();
		});

		$('body').on('click', '.btn-user', function(event) {
			event.preventDefault();
			mainController.onSelect(usersList[$(this).parent().index() - 1]);
		});

		//	Handle keyup on search field
		//	Make search only when search term is at least 3 symbols
		$('#search').on('keyup', function(event) {
			event.preventDefault();
			var input = $(this).val();
			if(timeout != null) {
				clearTimeout(timeout);
				//	Make search when search field is empty to get all users
				if($(this).val().length == 0)
				{
					searchMode = false;
					onSearch(input);
				}
				else if($(this).val().length > 2) {
					searchMode = true;
					onSearch(input);
				}	
			}
			else {
				if($(this).val().length > 2) {
					searchMode = true;
					onSearch(input);
				}
			}
		});

		$('#pages').pagination({
			pages: 0,
			cssStyle: 'light-theme',
			onPageClick: function(page) {
				currentPage = page;
				updateUsersList();
			},
			onInit: function() {
				pagesContext = this;
			}
		});
	}

	/**
	 * Invoked when typing in the search box.
	 */
	function onSearch(term) {
		$('#pages').pagination('selectPage', 1);
		searchTerm.term = term;
		searchTerm.page = 0;
		timeout = setTimeout(search, 1000);
	}
	
	/**
	 * Used to update the currently shown list of users,
	 * based on searching mode or normal viewing mode.
	 */
	function updateUsersList() {
		if(searchMode) {
			searchTerm.page = currentPage - 1;
			search(searchTerm);
		}
		else {
			loadUsers();
		}
	}

	/**
	 * Sends a request to the server for the users of
	 * the corresponding page, and shows them on success.
	 */
	function loadUsers() {
		var page = currentPage - 1;
		var requestData = {
			from : page*usersPerPage,
			to : page*usersPerPage + usersPerPage
		};
		request('users',
				'GET', 
				requestData, 
				"application/json; charset=utf-8",
				function(response) {
					listUsers(response);
				},
				function(response) {
					// TODO: create error flow
					console.log('Error loading users!');
					console.log(response);
				});
	}

	/**
	 * Calculates the necessary pages, based on the currently showed
	 * users per page and the total number of users, and redraws
	 * the pages.
	 * @param totalResults - total number of users
	 */
	function updatePages(totalResults) {
		var pages = Math.ceil(totalResults / usersPerPage);
		if(pagesContext.pages > pages)
			$('#pages').pagination('prevPage');
		pagesContext.pages = pages;
		$('#pages').pagination('redraw');
	}

	/**
	 * If necessary, converts the returned users from the server
	 * to an array list. 
	 */
	function listUsers(response) {
		usersList.length = 0;
		if(response.user != null) {
			if(response.user instanceof Array) {
				usersList = response.user;
			}
			else {
				usersList.push(response.user);
			}
		}
		show();
		updatePages(response.totalResults);
	}

	/**
	 * Sends a request to the server with the search term and
	 * parameters for corresponding users to get. On success
	 * shows the returned users.
	 */
	function search() {
		var searchData = {
			search : searchTerm.term,
			from : searchTerm.page * usersPerPage,
			to : searchTerm.page * usersPerPage + usersPerPage
		};
		request('users', 
			'GET', 
			searchData, 
			"application/json; charset=utf-8", 
			function(response) {
				listUsers(response);
			},
			function(response) {
				//	TODO: Error
			}
		);
	};

	/**
	 * Visualizes the returned from the server users.
	 */
	function show() {
		$("#users").find("li:gt(0)").remove();
		var listElement = $('#users li.user').clone();
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
	 * Displays a modal window asking the user to confirm the action.
	 * @param index - of the deleted user.
	 */
	function showModal(index) {
		var modalHtml = '<div id="dialog" title="Warning!">Are you sure you want to delete this user?</p></div>';
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
					"Delete" : function() {
						deleteUser(index);
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	}
	
	/**
	 * Invoked when the user confirms the action.
	 * Sends a request to the server to delete the user.
	 * @param index - of the deleted user
	 * @param dialogContext - modal window which invoked the operation.
	 */
	function deleteUser(index) {
		deletedUser = usersList[index];
		request('users/' + indexToId(index), 
			'DELETE', 
			null, 
			"application/json; charset=utf-8", 
			function(response) {
				updateUsersList();
				mainController.onDelete(deletedUser);
			},
			function(response) {
				// TODO: Show error message
				console.log(response);
			}
		);	
	};

	/**
	 * Gets the user's id corresponding to it's index in the list.
	 */
	function indexToId(index) {
		return usersList[index].userId;
	}

	/**
	 * Invoked by the users controller when saving an user.
	 */
	this.refresh = function() {
		updateUsersList();
	};
};
