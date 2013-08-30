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
		var articleToSend = {
			title : article.getTitle(),
			content : article.getContent()
		};
		var articlesLocal = this.articles;
		
		var dataToSend = new DataToSend(JSON.stringify(articleToSend), "application/json; charset=utf-8");
		request('articles/', 'PUT', dataToSend, function(result) {
			updateLocalArray(articlesLocal, article);
			listArticles();
			// TODO: message!
			console.log("Article added successfully");
		},
		function(result) {
			// TODO: create error flow
			console.log("Error");
			console.log(result);
		}); 
		
	};
	
	this.update = function(article) {
		var relativeURL = 'articles/' + article.getId();
		var dataToSend = {
				title : article.getTitle(),
				content : article.getContent()
		};
		request(relativeURL, 'POST', dataToSend, function(result) {
			alert("Article updated succesfully!");
			// TODO: update article locally !!!!!
		},
		function(result) {
			// TODO: create error flow
			alert("Error while updating article!");
			console.log(result);
		});
	};
	
	this.deleteArticle = function(article) {
		var relativeURL = 'articles/' + article.getId();
		request(relativeURL, 'DELETE', null, function(result) {
			alert("Article updated succesfully!");
			// TODO: delete article locally !!!!!
		},
		function(result) {
			// TODO: create error flow
			alert("Error while updating article!");
			console.log(result);
		});
	};
	
	this.getArticles = function() {
		return this.articles;
	};
	
	this.getArticle = function(index) {
		return this.articles[index];
	};
	
	function updateLocalArray(articlesLocal, article) {
		articlesLocal.push(article);
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


