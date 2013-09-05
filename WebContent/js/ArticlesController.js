function ArticlesController() {
	var articlesListController = new ArticlesListController(this);
	var articleDetailsController = new ArticleDetailsController(this);
	
	this.init = function() {
		$("#container").load('articles.html', function() {
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