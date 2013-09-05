$(document).ready(function() {
	var articlesListController = new ArticlesListController(null);
	articlesListController.init();
});

function ArticlesListController(articlesController) {
	var controller = articlesController;
	var listOfArticles = new Array();
	
	function bind() {
		$('body').on('click', '.btnDelete', function(event) {
			event.preventDefault();
			deleteArticle($(this).parent().index());
		});
		
		$('body').on('click', '#btnNew', function(event) {
			event.preventDefault();
			controller.onNew();
		});
	};
	
	function deleteArticle(index) {
		deletedArticle = listOfArticles[index];
		$.ajax({
			url: "http://localhost:8080/Articles/articles/" + indexToId(index),
			method: 'DELETE',
			data: null,
			contentType: "application/json; charset=utf-8", 
			xhrFields: {
			      withCredentials: true
			},
			crossDomain: true,
			success: function(result) {
				listOfArticles.splice(index, 1);
				saveToSessionStorage(listOfArticles);
				refreshList();
				controller.onDelete(deletedArticle);
			},
			error: function(result) {
				//	TODO: Show error message
				console.log(result);
			}
		});
		
	};

	function indexToId(index) {
		return listOfArticles[index]['@id'];
	}

	this.init = function() {
		this.loadArticles();
		
		console.log("init called");
		$('.main').load('articles.html .articlesList', function() {
			bind();
			
		});
	};

	this.loadArticles = function() {
		$.ajax({
			url: "http://localhost:8080/Articles/articles",
			method: 'GET',
			data: null,
			contentType: "application/json; charset=utf-8", 
			xhrFields: {
			      withCredentials: true
			},
			crossDomain: true,
			success: function(result) {
				if (result != null) {
					saveToSessionStorage(result.article);
					refreshList();
				}
			},
			error: function(result) {
				//	TODO: Show error message
				console.log(result);
			}
		});
	};
	
	function refreshList() {
		loadFromSessionStorage();
		var list = $('.list');
		var htmlString = '<ol class="articles">';
		
		list.html('<p>Articles:</p>');
		
		for ( var i = 0; i < listOfArticles.length; i++) {
			htmlString += '<li><a href="#" class="btn-article">'
					+ listOfArticles[i].title + '</a><button class="btnDelete">Delete</button></li>';
		}
		
		list.append(htmlString);
	};
	
	function search(term) {
		
	}
	
	function loadFromSessionStorage() {
		listOfArticles = $.parseJSON(sessionStorage.getItem('articles'));
	}
	
	function saveToSessionStorage(articles) {
		sessionStorage.clear();
		sessionStorage.setItem('articles', JSON.stringify(articles));
	}
}