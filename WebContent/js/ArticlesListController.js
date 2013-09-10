function ArticlesListController(articlesController) {
	var controller = articlesController;
	var listOfArticles = new Array();
	var timeout = null;

	this.init = function() {
		this.loadArticles();
		$('#articlesList').load('articles_list.html', function() {
			bind();
			console.log("init called");

		});
	};

	function bind() {
		//	Handles Delete button
		$('body').on('click', '.btnDelete', function(event) {
			event.preventDefault();
			showModal($(this).parent().index() - 1);
		});

		//	Handles New article button 
		$('body').on('click', '#btnNew', function(event) {
			event.preventDefault();
			controller.onNew();
		});

		//	Handle article selection
		$('body').on('click', '.btn-article', function(event) {
			event.preventDefault();
			controller.onSelect(listOfArticles[$(this).parent().index() - 1]);
		});

		//	Handle keyup on search field
		//	Make search only when search term is at least 3 symbols
		$('#search').on('keyup', function(event) {
			event.preventDefault();

			if(timeout != null) {
				clearTimeout(timeout);
				//	Make search when search field is empty to get all articles
				if($(this).val().length > 2 || $(this).val().length == 0) {
					timeout = setTimeout(search, 1000, $(this).val());
				}
			}
			else {
				if($(this).val().length > 2) {
					timeout = setTimeout(search, 1000, $(this).val());
				}
			}
		});
	};

	// TODO: Remove from here!
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
		deletedArticle = listOfArticles[index];
		request('articles/' + indexToId(index), 
			'DELETE', 
			null, 
			"application/json; charset=utf-8", 
			function(response) {
				listOfArticles.splice(index, 1);
					saveToSessionStorage(listOfArticles);
					refreshList();
					controller.onDelete(deletedArticle);
			},
			function(response) {
				// TODO: Show error message
				console.log(response);
			}
		);	
	};

	this.loadArticles = function() {
		request('articles/', 
			'GET', 
			null, 
			"application/json; charset=utf-8", 
			function(response) {
			console.log(response);
				if (response != null) {
					saveToSessionStorage(response.article);
					loadFromSessionStorage();
					refreshList();
				}
			},
			function(response) {
				// TODO: Show error message
				console.log(response);
				console.log(response.status + "!!!");
				if(response.status == 403) {
					sessionStorage.clear();
					window.location.reload();
				}
			}
		);
	};

	this.refresh = function() {
		loadFromSessionStorage();
		refreshList();
	};

	function refreshList() {
		if (listOfArticles instanceof Array) {
			$(".articles").find("li:gt(0)").remove();
			
			var listElement = $('.article').clone();
			listElement.removeAttr('style');
			listElement.removeClass('article');

			for(var i = 0; i < listOfArticles.length; i ++) {				
				listElement.find('.btn-article').text(listOfArticles[i].title);
				listElement.appendTo('.articles');
				listElement = listElement.clone();
			}
		}
	};

	function search(term) {
		console.log(term);

		request('articles/', 
			'GET', 
			{search:term}, 
			"application/json; charset=utf-8", 
			function(response) {
				listOfArticles = [];
				if (response != null) {
					if(response.article instanceof Array) {
						listOfArticles = response.article;
					}
					else {
						listOfArticles.push(response.article);
					}
				}
				refreshList();
			},
			function(response) {
				//	TODO: Error
			}
		);
	};

	function loadFromSessionStorage() {
		listOfArticles = [];
		result = $.parseJSON(sessionStorage.getItem('articles'));
		if(result instanceof Array) {
			listOfArticles = result;
			
		}
		else {
			listOfArticles.push(result);
		}
	};
	
	function saveToSessionStorage(articles) {
		sessionStorage.removeItem("articles");
		sessionStorage.setItem('articles', JSON.stringify(articles));
	}

	function indexToId(index) {
		return listOfArticles[index]['@id'];
	}
}