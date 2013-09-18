function ArticlesUI() {
	var config = {
			domain : "http://localhost:8080/Articles/"
	};
	
	this.request = function(relativeURL, options) {
		var requestOpt = $.extend({
			method : 'GET',
			data: null,
			contentType : 'application/json; charset=utf-8',
			success : function(response) {
				
			},
			error : function(response) {
				
			}
		}, options || {});
		
		console.log(requestOpt);
		requestOpt.someParam.someMore();
		
		$.ajax({
			url: config["domain"] + relativeURL,
			method: requestOpt.method,
			data: requestOpt.dataToSend,
			contentType: requestOpt.contentType,
			xhrFields: {
			      withCredentials: true
			},
			crossDomain: true,
			success: requestOpt.success,
			error: requestOpt.error
		});
	};
}