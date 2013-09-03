var users = listUsers();
$(document)
		.ready(
				function() {
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
						
						if(isChanged()) {
							//	TODO: Confirmation dialog
						}
						clear();
					});

					btnSave
							.click(function(event) {
								event.preventDefault();
								if (currentUser.getUserId() == undefined) {
									currentUser.password = userPasswordField
											.val();
									currentUser.type = userUserTypeField.val();
									currentUser.username = userUsernameField
											.val();
									currentUser.userId = userUserIdField.val();

									request(
											"administrator/users/",
											"PUT",
											new DataToSend(JSON
													.stringify(new UserDTO(
															userUsernameField
																	.val(),
															userPasswordField
																	.val(),
															userUserTypeField
																	.val())),
													"application/json; charset=utf-8"),
											function(result) {
												reloadUsers();
												clear();
											}, function(result) {
												console.log(result);
											});
								} else {
									request(
											"administrator/users/"
													+ currentUser.userId,
											"POST",
											new DataToSend(JSON
													.stringify(new UserDTO(
															userUsernameField
																	.val(),
															userPasswordField
																	.val(),
															userUserTypeField
																	.val())),
													"application/json; charset=utf-8"),
											function(result) {
												reloadUsers();
											}, function(result) {
												console.log(result);
											});
								}
							});

					btnDelete.click(function(event) {
						event.preventDefault();
						if (currentUser.getUserId() != undefined) {
							request("administrator/users/"
									+ currentUser.getUserId(), "DELETE",
									new DataToSend(null,
											"application/json; charset=utf-8"),
									function(result) {
										reloadUsers();
										clear();
									}, function(result) {
										// TODO: Error message
										console.log(result);
									});
						} else {
							// TODO: Error message
						}
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
					$('.list').on(
							'click',
							'.btn-user',
							function(event) {
								event.preventDefault();
								
								if(isChanged()) {
									//	TODO: Confirmation dialog
								}
								
								currentUser = users.getUsers()[$(this).parent()
										.index()];
								userUserIdField.val(currentUser.getUserId());
								userUsernameField
										.val(currentUser.getUsername());
								userPasswordField
										.val(currentUser.getPassword());
								userUserTypeField
										.val(currentUser.getUserType());
							});
					// ************************ End getting all users

					function clear() {
						currentUser = new User(null, null, null, "ADMIN");
						userUserIdField.val(null);
						userUsernameField.val(null);
						userPasswordField.val(null);
						userUserTypeField.val('ADMIN');
					}
					;

					function isChanged() {
						var username = currentUser.getUsername();
						var password = currentUser.getPassword();
						
						if(username == null) { 
							username = "";
						}
						if(password == null) {
							password = "";
						}
						
						if (username == userUsernameField.val()
								&& password == userPasswordField.val()
								&& currentUser.getUserType() == userUserTypeField.val()) {
							return false;
						}
						return true;
					};

				});

function listUsers() {
	var usersDTO = $.parseJSON(sessionStorage.getItem('users'));
	users = fillUsersArray(usersDTO);

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

// TODO: Better name
function fillUsersArray(usersDTO) {
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

// TODO: Move to env.
function UserDTO(username, password, type) {
	this.username = username;
	this.password = password;
	this.userType = type;

	this.getUsername = function() {
		return this.username;
	};

	this.getPassword = function() {
		return this.password;
	};

	this.getUserType = function() {
		return this.type;
	};
};

function reloadUsers() {
	request("administrator/users", "GET", new DataToSend(null, null), function(
			result) {
		sessionStorage.clear();
		sessionStorage.setItem('users', JSON.stringify(result.user));
		listUsers();
	}, function(result) {
		// TODO: Error !!!
		console.log(result);
	});
};
