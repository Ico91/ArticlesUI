function ArticleDetailsController() {
	var currentArticle = newArticle();
	var articleTitleField = {};
	var articleContentField = {};
	var articlesController = {};

	this.init = function() {
		$('#articleDetails').load('article_details.html', function() {
			articlesController = new ArticlesController();
			bind();
		});
	};

	this.show = function(article) {
		if(article != null) {
			if(articleIsModified())
				showModal();
			currentArticle = article;
		}
		else {
			currentArticle = newArticle();
		}
		articleTitleField.val(currentArticle.title);
		articleContentField.val(currentArticle.content);
	};
	
	this.articleDeleted = function(article) {
		if(currentArticle['@id'] === article['@id']) {
			this.show(null);
		}
	}

	this.getCurrentArticle = function() {
		return currentArticle;
	};
	
	function bind() {
		articleTitleField = $('#articleTitle');
		articleContentField = $('#articleContent');
		$('#btnSave').click(function(event) {
			event.preventDefault();
			if(!validateFields()) {
				return;
			}
			save();
		});
	}
	
	function save() {
		var dataToSend = {
			title : articleTitleField.val(),
			content : articleContentField.val()
		};
		if(articleExists()) {
			request('articles/' + currentArticle['@id'], 'POST', JSON.stringify(dataToSend), "application/json; charset=utf-8", function(response) {
				currentArticle.title = dataToSend.title;
				currentArticle.content = dataToSend.content;
				updateSessionStorage(currentArticle);
				// TODO: send message to user
				console.log(currentArticle);
				articlesController.onSave();
			},
			function(response) {
				// TODO: Create error flow
				console.log('Error saving article');
				console.log(response);
			});
		}
		else {
			request('articles/', 'PUT', JSON.stringify(dataToSend), "application/json; charset=utf-8", function(response) {
				currentArticle['@id'] = response['@id'];
				currentArticle.title = response.title;
				currentArticle.content = response.content;
				updateSessionStorage(currentArticle);
				// TODO: send message to user
				console.log(currentArticle);
				articlesController.onSave();
			},
			function(response) {
				// TODO: Create error flow
				console.log('Error saving article');
				console.log(response);
			});
		};
	};

	function articleExists() {
		if(currentArticle['@id'] == null)
			return false;

		return true;
	}

	function articleIsModified() {
		if(currentArticle.title != articleTitleField.val() || currentArticle.content != articleContentField)
			return true;

		return false;
	}

	function newArticle() {
		return {
			'@id' : null,
			title : "",
			content : ""
		};
	}
	
	function showModal() {
		var modalHtml = '<div id="dialog" title="Warning!">Your currently opened article is modified!<p>Do you want to continue without saving?</p></div>';
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
					"Save" : function() {
						save();
						$(this).dialog("close");
					},
					"Continue": function() {
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	}

	function validateFields() {
		if(articleTitleField.val() == "") {
			alert('Article title field is empty!');
			return false;
		}
		else if(articleContentField.val() == "") {
			alert('Article content field is empty');
			return false;
		}
		else
			return true;
	}

	function updateSessionStorage(article) {
		var index = null;
		var articles = $.parseJSON(sessionStorage.getItem('articles'));
		sessionStorage.clear();
		console.log(articles);
		
		for(var i = 0; i < articles.length; i++) {
			if(articles[i]['@id'] == article['@id'])
			{
				index = i;
				break;
			}
		}

		if(index != null) {
			articles[index].title = article.title;
			articles[index].content = article.content;
		}
		else {
			articles.push(article);
		}

		sessionStorage.setItem('articles', JSON.stringify(articles));
		// console
		console.log(sessionStorage.getItem('articles'));
	}
}