var ArticlesUI = {};

ArticlesUI.Config = {
	url : "http://localhost:8080/Articles/"
};

function request(relativeURL, method, dataToSend, contentType, successCallback, errorCallback) {
	$.ajax({
		url: ArticlesUI.Config["url"] + relativeURL,
		method: method,
		data: dataToSend,
		contentType: contentType,
		xhrFields: {
		      withCredentials: true
		},
		crossDomain: true,
		success: successCallback,
		error: errorCallback
	});
}

