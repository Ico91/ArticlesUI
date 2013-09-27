/*
 * Adds pagination to the specified by a selector
 * list and controls operation on it. 
 */
function PaginationComponent(context) {
	var itemsList = [];
	var pagesContext = {};
	var options = {};

	/*
	 * Initializes the pagination on the selector, specified
	 * by the properties object parameter.
	 * @param properties - object consisting of
	 * parameters (required or optional), used by
	 * the pagination plugin. 
	 */
	this.init = function(properties) {
		options = $.extend({
			selector : null, // selector of the pagination buttons
			url : null, // request url
			data : { }, // data to send
			listContainer : null, // selector of the list container
			listElement : null, // selector of an element in the list
			elementsPerPage : 10
		}, properties || {});

		$(options.selector).pagination({
			pages: 0,
			cssStyle: 'light-theme',
			onPageClick: function(page) {
				options.currentPage = page - 1;
				load(false);
			},
			onInit: function() {
				// load articles, users, etc... after loading html
				pagesContext = this;
				options.currentPage = 0;
				load(false);
			}
		});
	};

	/*
	 * Resends a request to the server.
	 * @param fromFirstPage - whether the pagination should start
	 * from the first page. Required when the calculated pages
	 * of the returned list of results are less than the currently
	 * active page.
	 * @param properties - object consisting of
	 * parameters (required or optional), used by
	 * the pagination plugin. If provided, this parameter
	 * will be merged with the current state of the pagination options.
	 */
	this.reload = function(fromFirstPage, properties) {
		load(fromFirstPage, properties);
	};

	/**
	 * Returns the item, corresponding to the specified index
	 * @param index
	 */
	this.getItem = function(index) {
		return itemsList[index];
	};
	
	/*
	 * Sends a request to the server with the provided parametes.
	 * @param fromFirstPage - whether the pagination should start
	 * from the first page.
	 * @param properties - object consisting of
	 * parameters (required or optional), used by
	 * the pagination plugin.
	 */
	function load(fromFirstPage, properties) {
		if(fromFirstPage === true) {
			options.currentPage = 0;
			$(options.selector).pagination('drawPage', 1);
		}
		if(properties != null) {
			options = $.extend(options, properties || {});
			for(var key in properties.data) {
				if(properties.data.hasOwnProperty(key) && properties.data[key] == '') {
					delete options.data[key];
				}
			}
		}

		var requestData = {
			from : options.currentPage*options.elementsPerPage,
			to : options.currentPage*options.elementsPerPage + parseInt(options.elementsPerPage)
		};
		
		options.data = $.extend(options.data, requestData);
		loadContents();
	}

	/*
	 * Sends a request to the server, to load the specified contents.
	 */
	function loadContents() {
		ServerRequest.request(options.url, {
			data: options.data,
			success: function(response) {
				updatePages(response);
				show(response);
			},
			error: function(response) {
				// TODO: create some error flow
				console.log('Error!!!!!!!!!!!!!');
				console.log(response);
			}
		});
	}

	/**
	 * Calculates the necessary pages, based on the currently showed
	 * elements per page and the total results returned by the server,
	 * and redraws the pages.
	 * @param totalResults - total number of results, returned by the server
	 */
	function updatePages(response) {
		var pages = Math.ceil(response.totalResults / options.elementsPerPage);
		if(pagesContext.pages > pages && pagesContext.pages == options.currentPage + 1) {
			$(options.selector).pagination('prevPage');
		}
		pagesContext.pages = pages;
		$(options.selector).pagination('redraw');
	}

	/**
	 * If necessary, converts the returned list of items from the server to an array
	 * list.
	 */
	function convertToList(response) {
		var responseList = Object.keys(response)[0];
		var list = [];
		if(response[responseList] != null && responseList != 'totalResults') {
			if(response[responseList] instanceof Array) {
				list = response[responseList];
			} else {
				list.push(response[responseList]);
			}
		}
		return list;
	};

	/**
	 * Visualizes the returned from the server list of items.
	 * @param response
	 */
	function show(response) {
		itemsList = convertToList(response);
		$(options.listContainer).find('li:gt(0)').remove();
		var listElement = $(options.listContainer + ' ' + options.listElement);
		listElement.removeAttr('style');
		if(itemsList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo(options.listContainer);
			return;
		}
		for(var i = 0; i < itemsList.length; i++) {
			listElement.html(renderItem(itemsList[i]));
			listElement.appendTo(options.listContainer);
			listElement = listElement.clone();
		}

	}

	/**
	 * Checks, if a rendering function is provided, to show the specified,
	 * as a parameter entity.
	 * @param entity - list item to show
	 * @returns If rendering function is provided, returns the context
	 * representation of the entity, otherwise returns it as a text.
	 */
	function renderItem(entity) {
		if(options.renderItem) {
			return options.renderItem(entity);
		}
		return entity;
	}


}