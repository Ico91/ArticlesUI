function ServerRequest() {
}

ServerRequest.config = {
		domain : "http://localhost:8080/Articles/"
};

ServerRequest.request = function(relativeURL, options) {
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
		url: ServerRequest.config["domain"] + relativeURL,
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

function dialogWindow(options) {
	var modalHtml = '<div id="dialog" title="' + 
					options.window.title + '">' +
					options.window.content + '</div>'; 
	$(options.selector).append(modalHtml);
	$('#dialog').dialog({
		resizable: false,
		closeOnEscape: true,
		draggable: true,
		hide: "explode",
		height:300,
		width: 350,
		modal: true,
		buttons: options.buttons
	});
}