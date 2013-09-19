function ArticlesUI() {
}

ArticlesUI.config = {
		domain : "http://localhost:8080/Articles/"
};

ArticlesUI.request = function(relativeURL, options) {
	var requestOpt = $.extend({
		method : 'GET',
		data: null,
		contentType : "application/json; charset=utf-8",
		success : function(response) {
			
		},
		error : function(response) {
			
		}
	}, options || {});
	
	$.ajax({
		url: ArticlesUI.config["domain"] + relativeURL,
		method: requestOpt.method,
		data: requestOpt.data,
		contentType: requestOpt.contentType,
		xhrFields: {
		      withCredentials: true
		},
		crossDomain: true,
		success: function(response) {
			requestOpt.success(response);
		},
		error: function(response) {
			requestOpt.error(response);
		}
	});
};