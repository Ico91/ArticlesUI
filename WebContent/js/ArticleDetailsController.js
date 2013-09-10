/**
 * Manages operations on the currently opened article.
 * @param articlesController - the context in which this controller works.
 */
function ArticleDetailsController(articlesController) {
	var currentArticle = newArticle();
	var articleTitleField = {};
	var articleContentField = {};
	var actionResult = {};
	this.articlesController = articlesController;

	/**
	 * Loads the necessary html contents.
	 */
	this.init = function() {
		$('#articleDetails').load('article_details.html', function() {
			bind();
		});
	};

	/**
	 * Shows the specified article.
	 * @param article - the article to display; 
	 * if null is passed, displays a new, empty article.
	 */
	this.show = function(article) {
		// checks whether currently opened article is modified
		if(currentArticle.title != articleTitleField.val() || currentArticle.content != articleContentField.val())
			showModal(article);
		else {
			visualize(article);
		}
	};
	
	/**
	 * Checks if the deleted article is the one currently shown and if true
	 * shows a new empty article.
	 */
	this.articleDeleted = function(article) {
		if(currentArticle['@id'] === article['@id']) {
			visualize(null);
		}
	};
	
	/**
	 * Displays the specified article in the appropriate text fields.
	 * @param article
	 */
	function visualize(article) {
		if(article != null)
			currentArticle = article;
		else 
			currentArticle = newArticle();
		articleTitleField.val(currentArticle.title);
		articleContentField.val(currentArticle.content);
	}
	
	/**
	 * Binds the necessary functions to the relevant controls
	 */
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
	
	/**
	 * Sends the appropriate request to the server for saving the currently opened article. 
	 * @param article
	 */
	function save(article) {
		var dataToSend = {
			title : articleTitleField.val(),
			content : articleContentField.val()
		};
		if(currentArticle['@id'] != null) {
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

	/**
	 * Validates the article text fields, returning false if they are empty.
	 * @returns {Boolean}
	 */
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

	/**
	 * 
	 * @returns Returns a new copy of empty article, without id. 
	 */
	function newArticle() {
		return {
			'@id' : null,
			title : "",
			content : ""
		};
	}
	
	/**
	 * Displays a modal window asking the user for appropriate actions.
	 * @param article
	 */
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

	/**
	 * Updates the browser's session storage with the last changes of
	 * the article.
	 * @param article
	 */
	function updateSessionStorage(article) {
		var index = null;
		var articles = $.parseJSON(sessionStorage.getItem('articles'));
		sessionStorage.removeItem('articles');
		
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

	/**
	 * Displays a message to the user, indicating the result of the last action.
	 * @param action
	 * @param result
	 */
	function notificateUser(action, result) {
		actionResult.css('opacity', 1);
		actionResult.show('slow');
		if(action === "save") {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.text('Article saved successfully!');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.text('Article could not be saved!');
			}
		}
		else {
			if(result == true) {
				actionResult.css('background', 'rgba(0, 204, 0, 1)');
				actionResult.text('Article updated successfully!');
			}
			else {
				actionResult.css('background', 'rgba(255, 0, 30, 1)');
				actionResult.text('Article could not be updated!');
			}
		}

		
		actionResult.animate({
			opacity: 0,
			height: "toggle"
		}, 2500);
	}
}