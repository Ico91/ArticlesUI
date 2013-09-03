$(document).ready(function() {
	var users = listUsers();
	
	var userUserIdField = $('#userID');
	var userUsernameField = $('#username');
	var userPasswordField = $('#password');
	var userUserTypeField = $('#types');

	var currentUser = new User(null, "", "", "ADMIN");
	
	var btnNew = $("#btn-new");
	var btnSave = $("#btn-save");
	var btnDelete = $("#btn-delete");
	var btnArticle = $("#btn-article");
	var btnLogout = $("#btn-logout");
	
	// ************************** Main buttons
	// ****************************************
	$(btnNew).click(function(event) {
		event.preventDefault();
		/*if (articleIsModified()) {
			console.log("Article is modified");
			// TODO: Create modal window
		}*/
		//currentArticle = new Article(null, "", "", true);
		userUserIdField.val('');
		userUsernameField.val('');
		userPasswordField.val('');
		userUserTypeField.val('ADMIN');
	});
	
	btnSave.click(function(event) {
		
	});
	
	btnDelete.click(function(event) {
		
	});
	
	btnArticle.click(function(event) {
		event.preventDefault();
		article();
	});
	
	btnLogout.click(function(event) {
		event.preventDefault();
		logout();
	});
	
	// **************************** End Main buttons
	// ****************************************

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

	// ******************* Get all users
	$('.list').on('click', '.btn-user', function(event) {
		event.preventDefault();
		/*
		 * if (articleIsModified()) { console.log("Article is modified"); //
		 * TODO: Create modal window }
		 */
		currentUser = users.getUsers()[$(this).parent().index()];
		userUserIdField.val(currentUser.getUserId());
		userUsernameField.val(currentUser.getUsername());
		userPasswordField.val(currentUser.getPassword());
		userUserTypeField.val(currentUser.getUserType());
	});
	// ************************ End getting all users
});

function listUsers() {
	var usersDTO = $.parseJSON(sessionStorage.getItem('users'));
	var users = getUsers(usersDTO);

	var list = $('.list');
	list.html('<p>Users:</p>');
	var htmlString = '<ol class="users">';
	for ( var i = 0; i < users.getUsers().length; i++) {
		htmlString += '<li><a href="#" class="btn-user">'
				+ users.getUser(i).getUsername() + '</a></li>';
	}
	htmlString += '</ol>';
	list.append(htmlString);

	return users;
};

function getUsers(usersDTO) {
	var users = new Users();
	if (usersDTO instanceof Array) {
		for ( var i = 0; i < usersDTO.length; i++) {
			users.getUsers().push(
					new User(parseInt(usersDTO[i].userId),
							usersDTO[i].username, usersDTO[i].password,
							usersDTO[i].userType));
		}
	} else
		users.getUsers().push(
				new User(parseInt(usersDTO.userId), usersDTO.username,
						usersDTO.password, usersDTO.userType));
	return users;
};

function article() {
	var logUser = new User(111, "admin", "123", "ADMIN");
	login(logUser);
	console.log(logUser.getUsername() + logUser.getUserId());
};

function logout() {
	var dataToSend = new DataToSend(null, null);
	request('users/logout', 'POST', dataToSend, function(result) {
		var url = "http://localhost:8080/ArticlesUI/";
		$(location).attr('href', url);
	}, function(result) {
		var url = "http://localhost:8080/ArticlesUI/unauthorized.html";
		$(location).attr('href', url);
	});
};
