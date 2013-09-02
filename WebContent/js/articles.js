$(document).ready(
		function() {
			var userId = getUserId();

			var articles = listArticles(); // list articles in html
			var articleTitleField = $('#articleTitle');
			var articleContentField = $('#articleContent');

			var currentArticle = new Article(null, "", "", true);

			// ************************ MAIN MENU BUTTONS
			// *************************************

			var btnNew = $("#btn-new");
			var btnSave = $("#btn-save");
			var btnDelete = $("#btn-delete");
			var btnLogout = $("#btn-logout");

			$(btnNew).click(
					function(event) {
						event.preventDefault();
						if (articleIsModified()) {
							console.log("Article is modified");
							// TODO: Create modal window
						}
						currentArticle = new Article(null, "", "", true);
						articleContentField.val('');
						articleTitleField.val('');
					});

			btnSave.click(function(event) {
				event.preventDefault();
				
				currentArticle.title = articleTitleField.val();
				currentArticle.content = articleContentField.val();
				
				articles.add(currentArticle);
				console.log(articles);
			});

			btnDelete.click(function(event) {
				event.preventDefault();
				// TODO: Create modal window
				currentArticle.deleteArticle();
				userArticles = getUserArticles();
			});

			btnLogout.click(function(event) {
				event.preventDefault();
				logout();
			});

			// *********************** END MAIN MENU BUTTONS
			// ************************************

			// ************************ Statistics buttons
			// *********************************
			var btnStatistics = $('#btn-statistics');
			var datepicker = $('#datepicker');

			datepicker.datepicker({
				dateFormat : 'yy/mm/dd'
			});

			btnStatistics.click(function(event) {
				event.preventDefault();
				pickDate(datepicker, userId);
			});
			// ************************ End statistics buttons
			// *******************************

			$('.list').on('click', '.btn-article', function(event) {
				event.preventDefault();
				if (articleIsModified()) {
					console.log("Article is modified");
					// TODO: Create modal window
				}
				currentArticle = articles.getArticles()[$(this).parent().index()];
				articleTitleField.val(currentArticle.getTitle());
				articleContentField.val(currentArticle.getContent());
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

function getUserId() {
	var querySearch = window.location.search.substring(1);
	var userIdPair = querySearch.split('=');
	return userIdPair[1];
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

function pickDate(datepicker, userId) {
	var date = "date=" + datepicker.val();
	var dataToSend = new DataToSend(date, null);
	request('statistics/' + userId, 'GET', dataToSend, function(result) {
		for ( var i = 0; i < result.length; i++) {
			console.log('\nUser activity - ' + result[i].userActivity
					+ '\nActivity date - ' + result[i].activityDate);
		}
	}, function(result) {
		console.log("Error ");
		console.log(result);
	});
};

function logout() {
	var dataToSend = new DataToSend(null, null);
	request('users/logout', 'POST', dataToSend, function(result) {
		var url = "http://localhost:8080/ArticlesUI/";    
		$(location).attr('href',url);
	}, function(result) {
		var url = "http://localhost:8080/ArticlesUI/unauthorized.html";    
		$(location).attr('href',url);
		//console.log("Error ");
		//console.log(result);
	});
};
