function init() {
	var statisticsModal = $('#statisticsModal');
	statisticsModal.show();
	bind();
};

function bind() {
	$("#datepicker").datepicker({
		onSelect : function(date) {
			// Originally here will be the code that gets the statistics -
			// function getStatistics()
			login(date);
		},
		dateFormat : 'yy/mm/dd'
	});

	$('body').on('click', '.btn-close', function(event) {
		event.preventDefault;
		close();
	});

	$('body').on('click', '.darken', function(event) {
		close();
	});
}

// Get statistics
function getStatistics(date) {
	var datestr = "date=" + date;
	var dataToSend = new DataToSend(datestr, null);

	request('users/statistics', 'GET', dataToSend, function(result) {
		showStatistics(result, date);
	}, function(result) {
		console.log("Error ");
		console.log(result);
	});
}
// *****************************

function showStatistics(result, date) {
	$("#user-statistics").find("li:gt(0)").remove();
	console.log("tuk");
	for ( var i = 0; i < result.length; i++) {
		var li = $('#user-statistics li.list-head').clone();
		console.log(li.html());
		$(li).removeClass('list-head');
		$(li).find('.head-date').text(result[i].activityDate);
		$(li).find('.head-activity').text(result[i].userActivity);
		$(li).appendTo('#user-statistics');
	}
};

function close() {
	$('#statisticsModal').hide();
	$('.darken').hide();
}

// ***************** Only for tests

var ArticlesUI = {};

ArticlesUI.Config = {
	url : "http://localhost:8080/Articles/"
};

function request(relativeURL, method, dataToSend, successCallback,
		errorCallback) {
	$.ajax({
		url : ArticlesUI.Config["url"] + relativeURL,
		method : method,
		data : dataToSend.getData(),
		contentType : dataToSend.getContentType(),
		xhrFields : {
			withCredentials : true
		},
		crossDomain : true,
		success : successCallback,
		error : errorCallback
	});
};

function DataToSend(data, contentType) {
	this.data = data;
	this.contentType = contentType;

	this.getData = function() {
		return this.data;
	};

	this.getContentType = function() {
		return this.contentType;
	};
};

function login(date) {
	var user = {
		username : "admin",
		password : "123",
	};
	var dataToSend = new DataToSend(JSON.stringify(user),
			"application/json; charset=utf-8");
	request('users/login', 'POST', dataToSend, function() {
		console.log("loggedin");
		getStatistics(date);
	}, function() {
		console.log("error");
	});

}
