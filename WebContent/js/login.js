$(document).ready(function(){
	$('#login-btn').click(function(event) {
		event.preventDefault();
		var user = { 
				username : $("#username").val(),
				password : $("#password").val(),		
		};	
		var dataToSend = new DataToSend(JSON.stringify(user), "application/json; charset=utf-8");	
		request('users/login', 'POST', dataToSend, login, error);
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
	sessionStorage.clear();
	sessionStorage.setItem('articles', JSON.stringify(response.article));
	window.location = "articles.html?userid=" + userId;
}

function error(result) {
	// TODO : FIX ERROR FLOW
	console.log("Error ");
	console.log(result);
}