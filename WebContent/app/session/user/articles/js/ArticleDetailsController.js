/**
 * Manages operations on the currently opened article.
 * 
 * @param articlesController -
 *            the context in which this controller works.
 */
function ArticleDetailsController(articlesController) {
	var currentArticle = newArticle();
	var articleTitleField = {};
	var articleContentField = {};
	var actionResult = {};

	var errorlist = {
		TITLE_IS_NULL : "Article title is null",
		TITLE_IS_EMPTY : "Article title is empty",
		CONTENT_IS_NULL : "Article content is null",
		CONTENT_IS_EMPTY : "Article content is empty",
		NOT_UNIQUE_TITLE : "Article title must be unique"
	};

	/**
	 * Loads the necessary html contents.
	 */
	this.init = function() {
		$('#articleDetails').load(
				'app/session/user/articles/html/article_details.html',
				function() {
					bind();
				});
	};

	/**
	 * Shows the specified article.
	 * 
	 * @param article -
	 *            the article to display; if null is passed, displays a new,
	 *            empty article.
	 * @param callback
	 */
	this.show = function(article, callback) {
		// checks whether currently opened article is modified
		if (currentArticle.title != articleTitleField.val()
				|| currentArticle.content != articleContentField.val())
			showModal(article, callback);
		else {
			visualize(article);
			if (callback != null)
				callback();
		}
	};

	/**
	 * Checks if the deleted article is the one currently shown and if true
	 * shows a new empty article.
	 */
	this.articleDeleted = function(article) {
		if (currentArticle['@id'] === article['@id']) {
			visualize(null);
		}
	};

	/**
	 * Displays the specified article in the appropriate text fields.
	 * 
	 * @param article
	 */
	function visualize(article) {
		if (article != null)
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
			save(currentArticle);
		});
	}

	/**
	 * Sends the appropriate request to the server for saving the currently
	 * opened article.
	 * 
	 * @param article
	 * @param callback -
	 *            method to be invoked on a successful save
	 */
	function save(article, callback) {
		if (!validateFields()) {
			return;
		}
		var dataToSend = {
			title : articleTitleField.val(),
			content : articleContentField.val()
		};
		if (currentArticle['@id'] != null) {
			ServerRequest.request('articles/' + currentArticle['@id'], {
				method : 'POST',
				data : JSON.stringify(dataToSend),
				success : function(response) {
					articleSaved(dataToSend, "update", true, callback);
					visualize(article);
				},
				error : function(response) {
					notificateUser("update", false, response);
					
				}
			});
		} else {
			ServerRequest.request('articles/', {
				method : 'PUT',
				data : JSON.stringify(dataToSend),
				success : function(response) {
					articleSaved(response, "save", true, callback);
					visualize(article);
				},
				error : function(response) {
					notificateUser("save", false, response);
					
				}
			});
		}
		;
	}
	;

	/**
	 * Invoked on successful server response.
	 * 
	 * @param articleData -
	 *            data to update the current article
	 * @param action -
	 *            operation on the article (create or modify)
	 * @param result -
	 *            result of the operation
	 * @param callback -
	 *            method to be called
	 */
	function articleSaved(articleData, action, result, callback) {
		if (action === "save")
			currentArticle['@id'] = articleData['@id'];
		currentArticle.title = articleData.title;
		currentArticle.content = articleData.content;
		if (callback != null)
			callback();
		if (sessionStorage.getItem('user') != null) {
			notificateUser(action, result);
			articlesController.onSave();
		}
	}

	/**
	 * Validates the article text fields, returning false if they are empty.
	 * 
	 * @returns {Boolean}
	 */
	function validateFields() {
		if (articleTitleField.val() == "") {
			alert('Article title field is empty!');
			return false;
		} else if (articleContentField.val() == "") {
			alert('Article content field is empty');
			return false;
		} else
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
	 * 
	 * @param article
	 * @param callback
	 */
	function showModal(article, callback) {
		var options = {
			window : {
				title : 'Warning!',
				content : "Your currently opened article is modified!<p>Save changes?</p>"
			},
			selector : '#articleDetails',
			buttons : buttons = {
				"Yes" : function() {
					save(article, callback);
					$(this).dialog("close");
				},
				"No" : function() {
					visualize(article);
					if (callback != null)
						callback();
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}

	/**
	 * Displays a message to the user, indicating the result of the last action.
	 * 
	 * @param action
	 * @param result
	 */
	function notificateUser(action, result, response) {
		if (action === "save") {
			if (result == true) {
				successAnimation('Article saved successfully!');
			} else {
				error(response);
			}
		} else {
			if (result == true) {
				successAnimation('Article updated successfully!');
			} else {
				error(response);
			}
		}		
	}
	
	function successAnimation(text) {
		actionResult.css('opacity', 1);
		actionResult.show('slow');
		actionResult.css('background', 'rgba(0, 204, 0, 1)');
		actionResult.text(text);
		actionResult.animate({
			opacity : 0,
			height : "toggle"
		}, 2500);
	}
	
	function error(response) {
		var errors = $.parseJSON(response.responseText);
		if (errors instanceof Array) {
			var errorText = "";
			for (var i = 0; i < errors.length; i++) {
				errorText += "<p>" + errorlist[errors[i].messages] + "</p>";
			}
			errorModal(errorText);
		} else {
			errorModal(errorlist[errors.messages]);
		}
	}

	function errorModal(errorContent) {
		var options = {
			window : {
				title : 'Error!',
				content : errorContent
			},
			selector : '#articleDetails',
			buttons : buttons = {
				"OK" : function() {
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}
}