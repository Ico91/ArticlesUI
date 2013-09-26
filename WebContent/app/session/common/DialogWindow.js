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
};