function ArticlesController() {
	var articlesListController = {};
	var articleDetailsController = {};
	
	this.init = function() {
		$("#container").load('articles.html', function() {
			articlesListController = new ArticlesListController();
			articleDetailsController = new ArticleDetailsController();

			articlesListController.init();
			articleDetailsController.init();

			bind();
		});
	};
	
	this.onNew = function() {
		articleDetailsController.show(null);
	};

	this.onSelect = function(article) {
		articleDetailsController.show(article);
	};

	this.onDelete = function(article) {
		articleDetailsController.articleDeleted(article);
	};

	this.onSave = function() {
		articlesListController.refreshList();
	};
	
	function bind() {
		// TODO: bind buttons
	}
}