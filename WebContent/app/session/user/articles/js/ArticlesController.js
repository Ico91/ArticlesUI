/**
 * Manages communication between the ArticlesListController & ArticleDetailsController
 */
function ArticlesController() {
	var articlesListController = {};
	var articleDetailsController = {};
	
	/**
	 * Loads the necessary html contents
	 */
	this.init = function() {
		articlesListController = new ArticlesListController(this);
		articlesListController.init();
		articleDetailsController = new ArticleDetailsController(this);
		articleDetailsController.init();
	};
	
	/**
	 * Invoked when creating a new article, tells the article details controller to show it.
	 */
	this.onNew = function() {
		show(null);
	};

	/**
	 * Invoked on selection an article from the list, tells the article details controller to show it
	 */
	this.onSelect = function(article) {
		show(article);
	};

	/**
	 * Invoked when deleting an article from the list, tells the article details controller to update the contents
	 */
	this.onDelete = function(article) {
		articleDetailsController.articleDeleted(article);
	};

	/**
	 * Invoked when saving an article, tells the articles list controller to update the list.
	 */
	this.onSave = function(action) {
		articleDetailsController.notificateUser(action);
		articlesListController.refresh();
	};
	
	
	/**
	 * Invoked when pressing the logout button, tells the article details controller
	 * to clear the fields, thus checking for a not saved article.
	 */
	this.logoutEnabled = function() {
		if(articleDetailsController.articleModified())
			return confirm();
		return true;
	};
	
	function show(article) {
		if(articleDetailsController.articleModified())
		{
			confirm().then(function (answer){
				if(answer)
					articleDetailsController.show(article);
			});
		}
		else
			articleDetailsController.show(article);
	}
	
	function confirm() {
		var defer = $.Deferred();
		showModal(defer);
		return defer.promise();
	}
	
	/**
	 * Displays a modal window asking the user for appropriate actions.
	 */
	function showModal(defer) {
		var options = {
			window : {
				title : 'Warning!',
				content : "Your currently opened article is modified! Do you want to continue without saving?"
			},
			selector : '.content',
			buttons : buttons = {
				"Yes" : function() {
					defer.resolve(true);
					$(this).dialog("close");
				},
				"No" : function() {
					defer.resolve(false);
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}
}