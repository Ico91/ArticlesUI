function ArticlesListController(context) {
	var paginationOptions = {
		selector: '#articles-pages',
		url : 'articles/',
		data : {
			allArticles : false
		},
		listContainer : '.articles',
		listElement : '.article',
	};

	var entityListController = {};
	
	/**
	 * Loads the necessary html contents, and the initial articles list
	 */
	this.init = function() {
		var controller = this;
		$('#articlesList').load('app/session/user/articles/html/articles_list.html', function() {
			bind();
			entityListController = new EntityListController(controller);
			var entityOptions = {
				id : 'id',
				selectorClass : 'btn-article',
				property : 'title',
				btnDelete : 'btn-delete'
			};
			
			entityListController.init(paginationOptions, entityOptions);
		});
	};

	/**
	 * Invoked by the articles controller when saving an article.
	 */
	this.refresh = function() {
		entityListController.refresh(false);
	};
	
	/**
	 * Invoked by the entity list controller when deleting an article. 
	 */
	this.onDelete = function(article) {
		context.onDelete(article);
	};
	
	/**
	 * Invoked by the entity list controller when selecting an article.
	 */
	this.onSelect = function(article) {
		context.onSelect(article);
	};
	
	/**
	 * Invoked by the entity list controller when creating a new article.
	 */
	this.onNew = function() {
		context.onNew();
	};
	
	/**
	 * Binds the necessary functions to the relevant controls
	 */
	function bind() {
		$('input[value="all"]').on('click', function() {
			allArticles = true;
			entityListController.refresh(true);
		});

		$('input[value="own"]').on('click', function() {
			allArticles = false;
			entityListController.refresh(true);
		});
	}
}