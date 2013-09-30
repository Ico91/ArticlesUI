function ServerRequest() {
}

ServerRequest.config = {
	domain : "http://localhost:8080/Articles/"
};

ServerRequest.request = function(relativeURL, options) {
	var requestOpt = $.extend({
		method : 'GET',
		data : null,
		contentType : "application/json; charset=utf-8",
		success : function(response) {

		},
		error : function(response) {

		}
	}, options || {});

	$.ajax({
		url : ServerRequest.config["domain"] + relativeURL,
		method : requestOpt.method,
		data : requestOpt.data,
		contentType : requestOpt.contentType,
		xhrFields : {
			withCredentials : true
		},
		crossDomain : true,
		success : function(response) {
			requestOpt.success(response);
		},
		error : function(response) {
			var statusCode = response.status;
			console.log(response.status);
			if (statusCode === 500) {
				errorModal(errorList.SERVER_ERROR);
			} else if (statusCode === 404) {
				errorModal(errorList.NOT_FOUND);
			} else {
				$.getScript("app/session/common/languages/en.js")
				.done( function() {
					error(response);
				})
				.fail( function() {
					errorModal("Something terrible has happend!!");
				});
			}
		}
	});
	
	/**
	 * Parse the response error message
	 */
	function error(response) {
		var errors = $.parseJSON(response.responseText);
		if (errors instanceof Array) {
			var errorText = "";
			for (var i = 0; i < errors.length; i++) {
				errorText += "<p>" + errorList[errors[i].messages] + "</p>";
			}
			errorModal(errorText);
		} else {
			errorModal(errorList[errors.messages]);
		}
	}

	/**
	 * Visualize the error messages in dialog window
	 */
	function errorModal(errorContent) {
		var options = {
			window : {
				title : 'Error!',
				content : errorContent
			},
			selector : '#container',
			buttons : buttons = {
				"OK" : function() {
					$(this).dialog("close");
				}
			}
		};
		dialogWindow(options);
	}
};