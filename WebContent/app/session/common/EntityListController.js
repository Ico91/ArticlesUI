function EntityListController(context) {
	var timeout = null;
	var searchMode = false;
	var paginationComponent = {};
	var paginationOptions = {};
	var entityOptions = {};
	
	/**
	 * Initializes the pagination component with the specified options
	 * from the context in which this operates.
	 * @param options - settings to initialize the pagination component with
	 * @param entity - setting to initialize the list controller with
	 */
	this.init = function(options, entity) {
		paginationOptions = options;
		entityOptions = entity;
		options.renderItem = function(item) {
			var btnSelect = '<a href="#" class="' + entity.selectorClass + '">' + item[entity.property] + '</a>';
			var btnDelete = '<a href="#" class="' + entity.btnDelete + '">X</a>';
			
			return btnSelect + btnDelete;
 		};
		paginationComponent = new PaginationComponent();
		paginationComponent.init(options);
		
		bind(entity);
	};
	
	/**
	 * Invoked, whenever changes to the list of items occur
	 * to resend the request and refresh it.
	 * @param fromFirstPage - whether the listed items should
	 * start from the first page.
	 */
	this.refresh = function(fromFirstPage) {
		updateList(fromFirstPage);
	};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	function bind(entity) {
		$('#btnNew').on('click', function(event) {
			event.preventDefault();
			context.onNew();
		});

		$('body').on('click', '.' + entity.btnDelete, function(event) {
			event.preventDefault();
			showDeleteModal($(this).parent().index());
		});
		
		$('body').on('click', '.' + entity.selectorClass, function(event) {
			event.preventDefault();
			context.onSelect(paginationComponent.getItem($(this).parent().index()));
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
	 * Shows a modal window to warn the user when deleting.
	 * @param index - the index of the deleted item in the list
	 */
	function showDeleteModal(index) {
		var options = {
				window : {
					title : 'Warning!',
					content : "Are you sure you want to delete this item?"
				},
				selector : '.content',
				buttons : buttons = {
					"Delete" : function() {
						deleteItem(index, this);
					},
					Cancel : function() {
						$(this).dialog("close");
					}
				}
		};
		dialogWindow(options);
	}

	/**
	 * Sends a request to the server to delete the specified item
	 */
	function deleteItem(index, dialogContext) {
		var deletedItem = indexToId(index);
		ServerRequest.request(paginationOptions.url + indexToId(index)[entityOptions.id], {
			method: 'DELETE',
			success: function(response) {
				updateList(false);
				context.onDelete(deletedItem);
				$(dialogContext).dialog("close");
			},
			error: function(response) {
				errorModal('Cannot delete item!');
			}
		});
	}

	/**
	 * Gets the item's id corresponding to it's index in the list.
	 * @param index
	 */
	function indexToId(index) {
		return paginationComponent.getItem(index);
	}

	/**
	 * Used to update the currently shown list of items, based on searching
	 * mode or normal viewing mode.
	 */
	function updateList(fromFirstPage) {
		if (searchMode) {
			search(fromFirstPage);
		} else {
			paginationComponent.reload(fromFirstPage);
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
	 * corresponding items to get. On success shows the returned entities.
	 */
	function search(fromFirstPage) {
		paginationComponent.reload(fromFirstPage, {
			data : {
				search : searchTerm
			}
		});
	};
	
	function errorModal(errorContent) {
		var options = {
			window : {
				title : 'Error!',
				content : errorContent
			},
			selector : '.content',
			buttons : buttons = {
				"OK" : function() {
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}
}