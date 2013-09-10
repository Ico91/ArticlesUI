$(document).ready(function() {
	$('#btn-statistics').click(function(event) {
		event.preventDefault();
		init();
	});
	
	$('#btn-logout').click(function(event) {
		event.preventDefault();
		logout();
	});
});

function logout() {
	var dataToSend = new DataToSend(null, null);
	request('users/logout', 'POST', dataToSend, function(result) {
		var url = "http://localhost:8080/ArticlesUI/";
		$(location).attr('href', url);
	}, function(result) {
		var url = "http://localhost:8080/ArticlesUI/unauthorized.html";    
		$(location).attr('href',url);
	});
}