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
		articleDetailsController = new ArticleDetailsController(this);
		articlesListController.init();
		articleDetailsController.init();
	};
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