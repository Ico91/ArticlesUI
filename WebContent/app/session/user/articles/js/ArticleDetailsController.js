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
	this.show = function(article) {
		visualize(article);
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
	 * Displays a message to the user, indicating the result of the last action.
	 * 
	 * @param method
	 * @param result
	 */
	this.notificateUser = function(method) {
		if (method === "PUT") {
			successAnimation('Article saved successfully!');
		} else {
			successAnimation('Article updated successfully!');
		}		
	};
	
	/**
	 * Whether the currently opened article is modified
	 */
	this.articleModified = function() {
		if (currentArticle.title != articleTitleField.val() || 
			currentArticle.content != articleContentField.val())
			return true;
		return false;
	};

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
	 * Displays the corresponding article fields on the view.
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
	 * Sends the appropriate request to the server for saving the currently
	 * opened article.
	 * 
	 * @param article
	 * @param callback -
	 *            method to be invoked on a successful save
	 */
	function save() {
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
					articleSaved(dataToSend, "POST");
				}
			});
		} else {
			ServerRequest.request('articles/', {
				method : 'PUT',
				data : JSON.stringify(dataToSend),
				success : function(response) {
					articleSaved(response, "PUT");
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
	 * @param method -
	 *            operation on the article (create or modify)
	 */
	function articleSaved(articleData, method) {
		if (method === "PUT")
			currentArticle['@id'] = articleData['@id'];
		currentArticle.title = articleData.title;
		currentArticle.content = articleData.content;
		articlesController.onSave(method);
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
	 * Animation on success request
	 * @param text
	 */
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
}