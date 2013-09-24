function ArticlesListController(context) {
	var timeout = null;
	var articlesList = [];
	var allArticles = false;
	var searchMode = false; // whether we're currently searching
	var searchTerm = {};
	var paginationController = {};

	/**
	 * Loads the necessary html contents, and the initial articles list
	 */
	this.init = function() {
		var controller = this;
		$('#articlesList').load('session/user/articles/html/articles_list.html', function() {
			bind();
			paginationController = new PaginationController(controller);
			paginationController.init({
				selector: "#articles-pages",
				url: "articles"
			});
		});
	};

	/**
	 * Invoked by the articles controller when saving an article.
	 */
	this.refresh = function() {
		updateArticlesList(false);
	};
	
	/**
	 * Visualizes the returned from the server articles.
	 */
	this.show = function(response) {
		listArticles(response);
		$(".articles").find("li:gt(0)").remove();
		var listElement = $('.article');
		listElement.removeAttr('style');
		if (articlesList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo('.articles');
			return;
		}
		if (articlesList instanceof Array) {
			for ( var i = 0; i < articlesList.length; i++) {
				listElement.find('.btn-article').text(articlesList[i].title);
				listElement.appendTo('.articles');
				listElement = listElement.clone();
			}
		};		
	};

	/**
	 * Binds the necessary functions to the relevant controls
	 */
	function bind() {
		$('body').on('click', '#btnDelete', function(event) {
			event.preventDefault();
			showModal($(this).parent().index());
		});

		$('#btnNew').on('click', function(event) {
			event.preventDefault();
			context.onNew();
		});

		/*$('input[value="all"]').on('click', function() {
			allArticles = true;
			updateArticlesList(true);
		});

		$('input[value="own"]').on('click', function() {
			allArticles = false;
			updateArticlesList(true);
		});*/

		$('body').on('click', '.btn-article', function(event) {
					event.preventDefault();
					context.onSelect(articlesList[$(this).parent()
							.index()]);
				});

		// Handle keyup on search field
		// Make search only when search term is at least 3 symbols
		$('#search').on('keyup', function(event) {
			event.preventDefault();
			var input = $(this).val();
			if (timeout != null) {
				clearTimeout(timeout);
				// Make search when search field is empty to get all articles
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
	 * Used to update the currently shown list of articles, based on searching
	 * mode or normal viewing mode.
	 */
	function updateArticlesList(fromFirstPage) {
		if (searchMode) {
			search(fromFirstPage);
		} else {
			paginationController.reload(fromFirstPage, {
				data : {
					all : allArticles
				} 
			});
		}
	}

	/**
	 * If necessary, converts the returned articles from the server to an array
	 * list.
	 */
	function listArticles(response) {
		articlesList.length = 0;
		if (response.article != null) {
			if (response.article instanceof Array) {
				articlesList = response.article;
			} else {
				articlesList.push(response.article);
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
	 * corresponding articles to get. On success shows the returned articles.
	 */
	function search(fromFirstPage) {
		paginationController.reload(fromFirstPage, {
			data : {
				search: searchTerm,
				all : allArticles
			},
		});
	};

	/**
	 * /** Displays a modal window asking the user to confirm the action.
	 * 
	 * @param index - of the deleted article.
	 */
	function showModal(index) {
		var modalHtml = '<div id="dialog" title="Warning!">Are you sure you want to delete this article?</p></div>';
		$('#articleDetails').append(modalHtml);
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
					deleteArticle(index, this);
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
	}

	/**
	 * Invoked when the user confirms the action. Sends a request to the server
	 * to delete the article.
	 * 
	 * @param index -
	 *            of the deleted article
	 * @param dialogContext -
	 *            modal window which invoked the operation.
	 */
	function deleteArticle(index, dialogContext) {
		deletedArticle = articlesList[index];
		ServerRequest.request('articles/' + indexToId(index), {
			method: 'DELETE',
			success: function(response) {
				updateArticlesList();
				context.onDelete(deletedArticle);
				$(dialogContext).dialog("close");
			},
			error: function(response) {
				alert('Cannot delete article!');
				console.log(response);
			}
		});
	};

	/**
	 * Gets the article's id corresponding to it's index in the list.
	 */
	function indexToId(index) {
		return articlesList[index]['@id'];
	}
}