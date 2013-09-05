$(document).ready(
		function() {
			$('#login-btn')
					.click(
							function(event) {
								event.preventDefault();
								var user = {
									username : $("#username").val(),
									password : $("#password").val(),
								};
								var dataToSend = new DataToSend(JSON
										.stringify(user),
										"application/json; charset=utf-8");
								request('users/login', 'POST', dataToSend,
										login, error);
							});
		});

// TODO : CREATE ERROR CALLBACK METHOD
function login(result) {
	var dataToSend = new DataToSend(null, null);
	request('articles/', 'GET', dataToSend, function(response) {
		getArticles(response, result.userId);
	}, error);
}

function getArticles(response, userId) {
	var articles = [];
	for(var i = 0; i < response.article.length; i++) {
		var article = response.article[i];
		articles.push(new Article(article["@id"], article.title, article.content, false));
	}
	
	sessionStorage.clear();
	if (response != null) {
		sessionStorage.setItem('articles', JSON.stringify(response.article));
	}
	window.location = "articles.html?userid=" + userId;
}

function error(result) {
	// TODO : FIX ERROR FLOW
	var container = $('#container');
	var error = '<p class="error">Wrong username or password</p>';
	container.append(error);
}