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
			requestOpt.error(response);
		}
	});
};
/* TODO: remove?
ServerRequest.getScript = function(url, callback) {
	$.getScript(url, function() {
		callback();
	}).done(function(script, textStatus) {
		console.log(textStatus);
	}).fail(function(jqxhr, settings, exception) {
		console.log("Triggered ajaxError handler.");
	});
};

ServerRequest.getCss = function(url) {
	$("head").append("<link>");
    css = $("head").children(":last");
    css.attr({ 
      rel:  "stylesheet",
      type: "text/css",
      href: url
    });
};
*/
// TODO: move somewhere else
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