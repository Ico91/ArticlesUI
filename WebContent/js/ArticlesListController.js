function ArticlesListController(articlesController) {
	var controller = articlesController;
	var listOfArticles = new Array();

	function bind() {
		$('body').on('click', '.btnDelete', function(event) {
			event.preventDefault();
			showModal($(this).parent().index());
		});

		$('body').on('click', '#btnNew', function(event) {
			event.preventDefault();
			controller.onNew();
		});

		$('body').on('click', '.btn-article', function(event) {
			event.preventDefault();
			controller.onSelect(listOfArticles[$(this).parent().index()]);
		});

		$('#search').on('keyup', function(event) {
			event.preventDefault();
			search($(this).val());
		});
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
		deletedArticle = listOfArticles[index];
		$
				.ajax({
					url : "http://localhost:8080/Articles/articles/"
							+ indexToId(index),
					method : 'DELETE',
					data : null,
					contentType : "application/json; charset=utf-8",
					xhrFields : {
						withCredentials : true
					},
					crossDomain : true,
					success : function(result) {
						listOfArticles.splice(index, 1);
						saveToSessionStorage(listOfArticles);
						refreshList();
						controller.onDelete(deletedArticle);
					},
					error : function(result) {
						// TODO: Show error message
						console.log(result);
					}
				});

	}
	;

	function indexToId(index) {
		return listOfArticles[index]['@id'];
	}

	this.init = function() {
		this.loadArticles();

		$('#articlesList').load('articles_list.html', function() {
			bind();
			console.log("init called");

		});
	};

	this.loadArticles = function() {
		$.ajax({
			url : "http://localhost:8080/Articles/articles",
			method : 'GET',
			data : null,
			contentType : "application/json; charset=utf-8",
			xhrFields : {
				withCredentials : true
			},
			crossDomain : true,
			success : function(result) {
				if (result != null) {
					saveToSessionStorage(result.article);
					loadFromSessionStorage();
					refreshList();
				}
			},
			error : function(result) {
				// TODO: Show error message
				console.log(result);
			}
		});
	};

	function refreshList() {
		var list = $('.list');
		var htmlString = '<ol class="articles">';
		
		if (listOfArticles instanceof Array) {
			for ( var i = 0; i < listOfArticles.length; i++) {
				htmlString += '<li><a href="#" class="btn-article">'
						+ listOfArticles[i].title
						+ '</a><button class="btnDelete">Delete</button></li>';
			}
		}
		else {
			htmlString += '<li><a href="#" class="btn-article">'
				+ listOfArticles.title
				+ '</a><button class="btnDelete">Delete</button></li>';
		}

		list.html(htmlString);
	};

	function search(term) {
		var url = "http://localhost:8080/Articles/articles?search=" + term;
		$.ajax({
			url : url,
			method : 'GET',
			data : null,
			contentType : "application/json; charset=utf-8",
			xhrFields : {
				withCredentials : true
			},
			crossDomain : true,
			success : function(result) {
				listOfArticles = [];
				if (result != null) {
					if(result.article instanceof Array) {
						listOfArticles = result.article;
					}
					else {
						listOfArticles.push(result.article);
					}
				}
				refreshList();
			},
			error : function(result) {
				// TODO: Show error message
				console.log(result);
			}
		});
	}

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
	
	this.refresh = function() {
		loadFromSessionStorage();
		refreshList();
	};
	
	function saveToSessionStorage(articles) {
		sessionStorage.clear();
		sessionStorage.setItem('articles', JSON.stringify(articles));
	}
}