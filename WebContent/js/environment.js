var ArticlesUI = {};

ArticlesUI.Config = {
	url : "http://localhost:8080/Articles/"
};


// TODO: MOVE THESE SOMEWHERE ELSE
function request(relativeURL, method, dataToSend, successCallback, errorCallback) {
	$.ajax({
		url: ArticlesUI.Config["url"] + relativeURL,
		method: method,
		data: dataToSend.getData(),
		contentType: dataToSend.getContentType(),
		xhrFields: {
		      withCredentials: true
		},
		crossDomain: true,
		success: successCallback,
		error: errorCallback
	});
}

function DataToSend(data, contentType) {
	this.data = data;
	this.contentType = contentType;
	
	this.getData = function() {
		return this.data;
	};
	
	this.getContentType = function() {
		return this.contentType;
	};
}

function Articles() {
	this.articles = [];
	
	this.add = function(article) {
		if(article.getTitle() === '' || article.getContent() === '')
			return "Article title or content is empty!";
		var relativeURL = 'articles/';
		var articleToSend = {
			title : article.getTitle(),
			content : article.getContent()
		};
		var articlesLocal = this.articles;
		var dataToSend = new DataToSend(JSON.stringify(articleToSend), "application/json; charset=utf-8");
		
		request(relativeURL, 'PUT', dataToSend, function(result) {
			articleToAdd = new Article(result["@id"], result.title, result.content);
			addToArticles(articlesLocal, articleToAdd);
			article.id = articleToAdd.id; // saved article becomes currently opened, so save it's id
			listArticles();
			// TODO: message!
			console.log("Article added successfully");
		},
		function(result) {
			// TODO: create error flow
			console.log("Error while adding new article!");
			console.log(result);
		}); 
		
	};
	
	this.update = function(article) {
		if(article.getTitle() === '' || article.getContent() === '')
			return "Article title or content is empty!";
		var relativeURL = 'articles/' + article.getId();
		var articleToSend = {
				title : article.getTitle(),
				content : article.getContent()
		};
		var articlesLocal = this.articles;
		var dataToSend = new DataToSend(JSON.stringify(articleToSend), "application/json; charset=utf-8");

		request(relativeURL, 'POST', dataToSend, function(result) {
			updateArticles(articlesLocal, article);
			listArticles();
			// TODO: message!
			console.log("Article updated succesfully!");
		},
		function(result) {
			// TODO: create error flow
			// TODO: update local ?!
			console.log("Error while updating article!");
			console.log(result);
		});
	};
	
	this.deleteArticle = function(article) {
		var relativeURL = 'articles/' + article.getId();
		var dataToSend = new DataToSend(null, null);
		var articlesLocal = this.articles;

		request(relativeURL, 'DELETE', dataToSend, function(result) {
			deleteFromArticles(articlesLocal, article);
			listArticles();
			// TODO: message!
			console.log("Article deleted succesfully!");
		},
		function(result) {
			// TODO: create error flow
			console.log("Error while deleting article!");
			console.log(result);
		});
	};
	
	this.getArticles = function() {
		return this.articles;
	};
	
	this.getArticle = function(index) {
		return this.articles[index];
	};

	function addToArticles(articlesLocal, articleToAdd) {
		articlesLocal.push(articleToAdd);
		updateSessionStorage(articlesLocal);
	}

	function updateArticles(articlesLocal, articleToUpdate) {
		$.grep(articlesLocal, function(article) { 
			if (article.id === articleToUpdate.id) {
				article.title = articleToUpdate.title;
				article.content = articleToUpdate.content;
			}
		});
		updateSessionStorage(articlesLocal);
	}

	function deleteFromArticles(articlesLocal, articleToDelete) {
		for(var i = 0; i < articlesLocal.length; i++) {
			if(articlesLocal[i].id === articleToDelete.id) {
				articlesLocal.splice(i, 1);
			}
		}
		updateSessionStorage(articlesLocal);
	}
	
	function updateSessionStorage(articlesLocal) {
		sessionStorage.clear();
		sessionStorage.setItem('articles', JSON.stringify(articlesLocal));
	}

}

function Article(id, title, content, isNew) {
	this.id = id;
	this.title = title;
	this.content = content;
	this.isNew = isNew;

	this.getId = function() {
		return this.id;
	};

	this.getTitle = function() {
		return this.title;
	};
	this.getContent = function() {
		return this.content;
	};
	
	this.getIsNew = function() {
		return this.isNew;
	};
}


