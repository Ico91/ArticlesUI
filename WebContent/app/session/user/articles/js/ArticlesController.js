/**
 * Manages communication between the ArticlesListController & ArticleDetailsController
 */
function ArticlesController() {
	var controller = this;
	var articlesListController = {};
	var articleDetailsController = {};
	
	/**
	 * Loads the necessary html contents
	 */
	this.init = function() {
		ServerRequest.getScript("app/session/user/articles/js/ArticlesListController.js", articlesListInit);
		ServerRequest.getScript("app/session/user/articles/js/ArticleDetailsController.js", articleDetailsInit);
	};
	
	function articlesListInit() {
		articlesListController = new ArticlesListController(controller);
		articlesListController.init();
	}
	
	function articleDetailsInit() {
		articleDetailsController = new ArticleDetailsController(controller);
		articleDetailsController.init();
	}
	/**
	 * Invoked when creating a new article, tells the article details controller to show it.
	 */
	this.onNew = function() {
		articleDetailsController.show(null);
	};

	/**
	 * Invoked on selection an article from the list, tells the article details controller to show it
	 */
	this.onSelect = function(article) {
		articleDetailsController.show(article);
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
	this.onSave = function() {
		articlesListController.refresh();
	};
	
	/**
	 * Invoked when pressing the logout button, tells the article details controller
	 * to clear the fields, thus checking for a not saved article.
	 */
	this.onLogout = function(callback) {
		articleDetailsController.show(null, callback);
	};
}