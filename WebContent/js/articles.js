$(document).ready(
		function() {
			var articles = listArticles(); // list articles in html
			var articleTitleField = $('#articleTitle');
			var articleContentField = $('#articleContent');

			var currentArticle = new Article(null, "", "", true);

			//  MAIN MENU BUTTONS
			
			var btnNew = $("#btn-new");
			var btnSave = $("#btn-save");
			var btnDelete = $("#btn-delete");
			var btnLogout = $("#btn-logout");

			$(btnNew).click(
					function(event) {
						event.preventDefault();
						if (articleIsModified()) {
							var formData = {
								"title" : articleTitleField.val(),
								"content" : articleContentField.val()
							};
							modalSave(articles, currentArticle, formData);
						}
						currentArticle = new Article(null, "", "", true);
						articleContentField.val('');
						articleTitleField.val('');
					});

			btnSave.click(function(event) {
				event.preventDefault();
				currentArticle.title = articleTitleField.val();
				currentArticle.content = articleContentField.val();
				saveArticle(articles, currentArticle);
			});

			btnDelete.click(function(event) {
				event.preventDefault();
				if(currentArticle.id === null) {
					alert("Please choose an article first!");
					return;
				}
				modalDelete(articles, currentArticle, articleTitleField, articleContentField);
			});

			btnLogout.click(function(event) {
				event.preventDefault();
				logout();
			});

			//  END MAIN MENU BUTTONS

			// Statistics button
			var btnStatistics = $('#btn-statistics');
			var datepicker = $('#datepicker');

			datepicker.datepicker({
				dateFormat : 'yy/mm/dd'
			});

			btnStatistics.click(function(event) {
				event.preventDefault();
				pickDate(datepicker);
			});


			$('body').on('click', '.btn-close', function(event) {
				event.preventDefault;
				$('#statisticsModal').hide();
				$('.darken').hide();
			});
			
			$('body').on('click', '.darken', function(event) {
				$('#statisticsModal').hide();
				$('.darken').hide();
			});
			//  End statistics buttons
			
			// Articles list

			$('.list').on('click', '.btn-article', function(event) {
				event.preventDefault();
				if (articleIsModified()) {
					var formData = {
						"title" : articleTitleField.val(),
						"content" : articleContentField.val()
					};
					modalSave(articles, currentArticle, formData);
				}
				currentArticle = articles.getArticles()[$(this).parent().index()];
				articleTitleField.val(currentArticle.getTitle());
				articleContentField.val(currentArticle.getContent());
			});
			
			// End Articles list

			// Search

			var search = $('#search');

			$(search).keyup(function(event) {
				if(search.val() != '')
					searchArticle(articles.getArticles(), search.val());
				else
					listArticles();
			});

			function articleIsModified() {
				if(articleContentField.val().length > 0 || articleTitleField.val() > 0)
				{
					if (currentArticle.getContent() != articleContentField.val()
							|| currentArticle.getTitle() != articleTitleField.val()) {
						return true;
					}
				}
				
				return false;
			}
		});

function searchArticle(container, input) {

	var articles = [];
	for(var i = 0; i < container.length; i++) {
		if(container[i].getTitle().indexOf(input) != -1 || container[i].getContent().indexOf(input) != -1)
			articles.push(container[i]);
	}

	var list = $('.list');
	list.html('<p>Articles:</p>');
	var htmlString = '<ol class="articles">';
	for ( var i = 0; i < articles.length; i++) {
		htmlString += '<li><a href="#" class="btn-article">'
				+ articles[i].getTitle() + '</a></li>';
	}
	htmlString += '</ol>';
	list.append(htmlString);
}

function getArticles(articlesDTO) {
	var articles = new Articles();
	if (articlesDTO instanceof Array) {
		for ( var i = 0; i < articlesDTO.length; i++) {
			articles.getArticles()
					.push(
							new Article(parseInt(articlesDTO[i].id),
									articlesDTO[i].title,
									articlesDTO[i].content, false));
		}
	} else
		articles.getArticles().push(
				new Article(parseInt(articlesDTO.id), articlesDTO.title,
						articlesDTO.content, false));
	return articles;
}

function listArticles() {
	// get articles from sessionStorage
	var articlesDTO = $.parseJSON(sessionStorage.getItem('articles')); 
	// convert articlesDTO to Articles object
	var articles = getArticles(articlesDTO); 
	
	var list = $('.list');
	list.html('<p>Articles:</p>');
	var htmlString = '<ol class="articles">';
	for ( var i = 0; i < articles.getArticles().length; i++) {
		htmlString += '<li><a href="#" class="btn-article">'
				+ articles.getArticle(i).getTitle() + '</a></li>';
	}
	htmlString += '</ol>';
	list.append(htmlString);
	
	return articles;
};

function saveArticle(articles, currentArticle) {
	var existingArticles = $.grep(articles.getArticles(), function(article) { return article.id === currentArticle.id; });
	if(existingArticles.length == 0) {
		articles.add(currentArticle);

	}
	else if(existingArticles.length == 1) {
		articles.update(currentArticle);
	}
	else {
		alert("Error: multiple results found, article could not be saved!");
	}
}

function logout() {
	var dataToSend = new DataToSend(null, null);
	request('users/logout', 'POST', dataToSend, function(result) {
		var url = "http://localhost:8080/ArticlesUI/";    
		$(location).attr('href',url);
	}, function(result) {
		var url = "http://localhost:8080/ArticlesUI/unauthorized.html";    
		$(location).attr('href',url);
	});
};

function modalDelete(articles, currentArticle, articleTitleField, articleContentField) {
	var modalHtml = '<div id="dialog" title="Warning!">Are you sure you want to delete this article?</div>';
	$('.currentArticle').append(modalHtml);
	$( "#dialog" ).dialog({
		resizable: false,
		closeOnEscape: true,
		draggable: true,
		hide: "explode",
		height:250,
		modal: true,
		buttons: buttons = {
				"Continue": function() {
					articles.deleteArticle(currentArticle);
					currentArticle = new Article(null, "", "", true);
					articleTitleField.val('');
					articleContentField.val('');
					$(this).dialog("close");
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
		}
	});
}

function modalSave(articles, currentArticle, formData) {
	var modalHtml = '<div id="dialog" title="Warning!">Your currently opened article is modified!<p>Do you want to continue without saving?</p></div>';
	$('.currentArticle').append(modalHtml);
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
					currentArticle.title = formData.title;
					currentArticle.content = formData.content;
					saveArticle(articles, currentArticle);
					$(this).dialog("close");
				},
				"Continue": function() {
					$(this).dialog("close");
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
		}
	});
}

function showStatistics(result, date) {
	var statisticsModal = $('#statisticsModal');
	var background = '<div class="darken">&nbsp;</div>';
	$('body').append(background);

	var statisticsHTML = '<h2>Statistics for <span class="date">' + date + '</span></h2>';
	statisticsHTML += '<ul class="user-statistics">';
	statisticsHTML += '<li><span class="activity-date statistics-head">Activity date:</span><span class="activity statistics-head">Activity:</span>';
	for ( var i = 0; i < result.length; i++) {
			statisticsHTML += '<li><span class="activity-date">' + result[i].activityDate + '</span>';
			statisticsHTML += '<span class="activity">' + result[i].userActivity + '</span></li>';
	}
	statisticsHTML += '</ul>';
	statisticsHTML += '<a href="#" class="btn-close">Close</a>';
	$(statisticsModal).html(statisticsHTML);
	$(statisticsModal).slideDown();
}

function pickDate(datepicker) {
	var date = "date=" + datepicker.val();
	var dataToSend = new DataToSend(date, null);
	request('users/statistics', 'GET', dataToSend, function(result) {
		showStatistics(result, datepicker.val());
	}, function(result) {
		console.log("Error ");
		console.log(result);
	});
};
