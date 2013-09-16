function ArticlesListController(mainController) {
	var timeout = null; // used for search timer
	var articlesList = []; // list of articles on the current page
	var allArticles = false; // whether to search amongst all users' articles
	var searchMode = false; // whether we're currently searching
	var searchTerm = {
		term : null, // what's been searched
		page : 0 // which results to show
	};
	var currentPage = 1; // currently viewed page
	var articlesPerPage = 10; // articles per page to show
	var pagesContext = {}; // object responsible for the pagination

	/**
	 * Loads the necessary html contents, and the initial articles list
	 */
	this.init = function() {
		$('#articlesList').load('articles_list.html', function() {
			bind();
			loadArticles();
		});
	};

	/**
	 * Invoked by the articles controller when saving an article.
	 */
	this.refresh = function() {
		updateArticlesList();
	};
	
	/**
	 * Binds the necessary functions to the relevant controls
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

		$('input[value="all"]').on('click', function() {
			allArticles = true;
			goToFirstPage();
			updateArticlesList();
		});

		$('input[value="own"]').on('click', function() {
			allArticles = false;
			goToFirstPage();
			updateArticlesList();
		});

		$('body').on('click', '.btn-article', function(event) {
			event.preventDefault();
			mainController.onSelect(articlesList[$(this).parent().index() - 1]);
		});

		//	Handle keyup on search field
		//	Make search only when search term is at least 3 symbols
		$('#search').on('keyup', function(event) {
			event.preventDefault();
			var input = $(this).val();
			if(timeout != null) {
				clearTimeout(timeout);
				//	Make search when search field is empty to get all articles
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
				updateArticlesList();
			},
			onInit: function() {
				pagesContext = this;
			}
		});
	}

	/**
	 * Used to update the currently shown list of articles,
	 * based on searching mode or normal viewing mode.
	 */
	function updateArticlesList() {
		if(searchMode) {
			searchTerm.page = currentPage - 1;
			search(searchTerm);
		}
		else {
			loadArticles();
		}
	}
	
	/**
	 * Sends a request to the server for the articles of
	 * the corresponding page, and shows them on success.
	 */
	function loadArticles() {
		var page = currentPage - 1;
		var requestData = {
			from : page*articlesPerPage,
			to : page*articlesPerPage + articlesPerPage,
			all : allArticles
		};
		request('articles',
				'GET', 
				requestData, 
				"application/json; charset=utf-8",
				function(response) {
					listArticles(response);
				},
				function(response) {
					// TODO: create error flow
					console.log('Error loading articles!');
					console.log(response);
				});
	}
	
	/**
	 * If necessary, converts the returned articles from the server
	 * to an array list. 
	 */
	function listArticles(response) {
		articlesList.length = 0;
		if(response.article != null) {
			if(response.article instanceof Array) {
				articlesList = response.article;
			}
			else {
				articlesList.push(response.article);
			}
		}
		show();
		updatePages(response.totalResults);
	}
	
	/**
	 * Visualizes the returned from the server articles.
	 */
	function show() {
		$(".articles").find("li:gt(0)").remove();	
		var listElement = $('.article').clone();
		listElement.removeAttr('style');
		listElement.removeClass('article');
		if (articlesList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo('.articles');
			return;
		}
		if (articlesList instanceof Array) {
			for(var i = 0; i < articlesList.length; i ++) {				
				listElement.find('.btn-article').text(articlesList[i].title);
				listElement.appendTo('.articles');
				listElement = listElement.clone();
			}
		};
	};

	/**
	 * Calculates the necessary pages, based on the currently showed
	 * articles per page and the total number of articles, and redraws
	 * the pages.
	 * @param totalResults - total number of articles
	 */
	function updatePages(totalResults) {
		var pages = Math.ceil(totalResults / articlesPerPage);
		if(pagesContext.pages > pages && pagesContext.pages == currentPage)
			$('#pages').pagination('prevPage');
		pagesContext.pages = pages;
		$('#pages').pagination('redraw');
	}	
	
	/**
	 * Used when switching between search and normal viewing mode,
	 * and between all user's articles and user's own articles/
	 */
	function goToFirstPage() {
		currentPage = 1;
		$('#pages').pagination('selectPage', 1);
	}

	/**
	 * Invoked when typing in the search box.
	 */
	function onSearch(term) {
		goToFirstPage();
		searchTerm.term = term;
		searchTerm.page = 0;
		timeout = setTimeout(search, 1000);
	}

	/**
	 * Sends a request to the server with the search term and
	 * parameters for corresponding articles to get. On success
	 * shows the returned articles.
	 */
	function search() {
		var searchData = {
			search : searchTerm.term,
			from : searchTerm.page * articlesPerPage,
			to : searchTerm.page * articlesPerPage + articlesPerPage,
			all : allArticles
		};
		request('articles', 
			'GET', 
			searchData, 
			"application/json; charset=utf-8", 
			function(response) {
				listArticles(response);
			},
			function(response) {
				//	TODO: Error
			}
		);
	};

	/**
	 * /**
	 * Displays a modal window asking the user to confirm the action.
	 * @param index - of the deleted article.
	 */
	function showModal(index) {
		var modalHtml = '<div id="dialog" title="Warning!">Are you sure you want to delete this article?</p></div>';
		$('#articleDetails').append(modalHtml);
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
						deleteArticle(index, this);
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	}
	
	/**
	 * Invoked when the user confirms the action.
	 * Sends a request to the server to delete the article.
	 * @param index - of the deleted article
	 * @param dialogContext - modal window which invoked the operation.
	 */
	function deleteArticle(index, dialogContext) {
		deletedArticle = articlesList[index];
		request('articles/' + indexToId(index), 
			'DELETE', 
			null, 
			"application/json; charset=utf-8", 
			function(response) {
				updateArticlesList();
				mainController.onDelete(deletedArticle);
				$(dialogContext).dialog("close");
			},
			function(response) {
				alert('Cannot delete article!');
				console.log(response);
			}
		);	
	};

	/**
	 * Gets the article's id corresponding to it's index in the list.
	 */
	function indexToId(index) {
		return articlesList[index]['@id'];
	}
}