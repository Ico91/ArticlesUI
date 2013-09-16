function ArticlesListController(mainController) {
	var timeout = null;
	var articlesList = [];
	var allArticles = false;
	var searchMode = false;
	var searchTerm = {
		term : null,
		page : 0
	};
	var currentPage = 1;
	var articlesPerPage = 10;
	var pagesContext = {};

	this.init = function() {
		$('#articlesList').load('articles_list.html', function() {
			bind();
			loadArticles();
		});
	};

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
			currentPage = 1;
			updateArticlesList();
		});

		$('input[value="own"]').on('click', function() {
			allArticles = false;
			currentPage = 1;
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

	function onSearch(term) {
		$('#pages').pagination('selectPage', 1);
		searchTerm.term = term;
		searchTerm.page = 0;
		timeout = setTimeout(search, 1000);
	}

	function updateArticlesList() {
		if(searchMode) {
			searchTerm.page = currentPage - 1;
			search(searchTerm);
		}
		else {
			loadArticles();
		}
	}

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

	function updatePages(totalResults) {
		var pages = Math.ceil(totalResults / articlesPerPage);
		if(pagesContext.pages > pages)
			$('#pages').pagination('prevPage');
		pagesContext.pages = pages;
		$('#pages').pagination('redraw');
	}

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
						deleteArticle(index);
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	}
	
	function deleteArticle(index) {
		deletedArticle = articlesList[index];
		request('articles/' + indexToId(index), 
			'DELETE', 
			null, 
			"application/json; charset=utf-8", 
			function(response) {
				updateArticlesList();
				mainController.onDelete(deletedArticle);
			},
			function(response) {
				// TODO: Show error message
				console.log(response);
			}
		);	
	};

	function indexToId(index) {
		return articlesList[index]['@id'];
	}

	this.refresh = function() {
		updateArticlesList();
	};
}