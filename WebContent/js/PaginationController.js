/*
 * Adds pagination to the specified by a selector
 * list and controls operation on it. 
 */
function PaginationController(context) {
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
			selector : null,
			url : null,
			data : { },
			elementsPerPage : 10,
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
		
		var data = $.extend(options.data, requestData);
		options.data = data;
		loadContents();
	}

	/*
	 * Sends a request to the server, to load the specified contents.
	 */
	function loadContents() {
		ArticlesRequest.request(options.url, {
			data: options.data,
			success: function(response) {
				context.show(response);
				updatePages(response.totalResults);
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
	function updatePages(totalResults) {
		var pages = Math.ceil(totalResults / options.elementsPerPage);
		if(pagesContext.pages > pages && pagesContext.pages == options.currentPage)
			$(options.selector).pagination('prevPage');
		pagesContext.pages = pages;
		$(options.selector).pagination('redraw');
	}
}