function StatisticsController() {
	this.init = function() {
		$("#statisticsModal").load('statistics.html', function() {
			bind();
		});
	};

	function bind() {
		$("#datepicker").datepicker({
			onSelect : function(date) {
				var datestr = "date=" + date;

				request('users/statistics', 'GET', datestr, null, function(result) {
					showStatistics(result, date);
				}, function(result) {
					console.log("Error ");
					console.log(result);
				});
			},
			dateFormat : 'yy/mm/dd',
		});
	
		$('body').on('click', '.btn-close', function(event) {
			event.preventDefault;
			close();
		});
	
	}

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
		};
	};

	function close() {
		$('#statisticsModal').hide();
		$('.darken').hide();
	};
}
