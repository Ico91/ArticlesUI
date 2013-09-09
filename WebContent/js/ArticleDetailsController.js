function ArticleDetailsController(articlesController) {
	var currentArticle = newArticle();
	var articleTitleField = {};
	var articleContentField = {};
	var actionResult = {};
	this.articlesController = articlesController;

	this.init = function() {
		$('#articleDetails').load('article_details.html', function() {
			bind();
		});
	};

	this.show = function(article) {
		if(articleIsModified())
			showModal(article);
		else {
			visualize(article);
		}
	};
	
	this.articleDeleted = function(article) {
		if(currentArticle['@id'] === article['@id']) {
			visualize(null);
		}
	};
	
	function visualize(article) {
		if(article != null)
			currentArticle = article;
		else 
			currentArticle = newArticle();
		articleTitleField.val(currentArticle.title);
		articleContentField.val(currentArticle.content);
	}
	
	function bind() {
		articleTitleField = $('#articleTitle');
		articleContentField = $('#articleContent');
		actionResult = $('#action-result');
		actionResult.hide();
		$('#btnSave').click(function(event) {
			event.preventDefault();
			if(!validateFields()) {
				return;
			}
			save(currentArticle);
		});
	}
	
	function save(article) {
		var dataToSend = {
			title : articleTitleField.val(),
			content : articleContentField.val()
		};
		if(!articleExists()) {
			request('articles/' + currentArticle['@id'], 'POST', JSON.stringify(dataToSend), "application/json; charset=utf-8", function(response) {
				currentArticle.title = articleTitleField.val();
				currentArticle.content = articleContentField.val();
				updateSessionStorage(currentArticle);
				notificateUser("update", true);
				visualize(article);
			},
			function(response) {
				// TODO: create error flow
				notificateUser("update", false);
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
				notificateUser("save", true);
				visualize(article);
			},
			function(response) {
				// TODO: Create error flow
				notificateUser("save", false);
				console.log('Error saving article');
				console.log(response);
			});
		};
	};

	function articleExists() {
		console.log(currentArticle['@id']);
		return (currentArticle['@id'] == null);
	}

	function articleIsModified() {
		return (currentArticle.title != articleTitleField.val() || currentArticle.content != articleContentField.val());
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

	function newArticle() {
		return {
			'@id' : null,
			title : "",
			content : ""
		};
	}
	
	function showModal(article) {
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
						save(article);
						$(this).dialog("close");
					},
					"Continue": function() {
						visualize(article);
						$(this).dialog("close");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
			}
		});
	}

	function updateSessionStorage(article) {
		var index = null;
		var articles = $.parseJSON(sessionStorage.getItem('articles'));
		sessionStorage.clear();
		
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
		articlesController.onSave();
	}

	function notificateUser(action, result) {
		actionResult.css('opacity', 1);
		actionResult.show('slow');
		if(action === "save") {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.html('<p>Article saved successfully!</p>');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.html('<p>Article could not be saved!</p>');
			}
		}
		else {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.html('<p>Article updated successfully!</p>');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.html('<p>Article could not be updated!</p>');
			}
		}

		
		actionResult.animate({
			opacity: 0,
			height: "toggle"
		}, 4000);
	}
}