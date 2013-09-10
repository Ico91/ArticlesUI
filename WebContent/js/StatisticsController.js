function StatisticsController() {
	this.init = function() {
		$("#statisticsModal").load('statistics.html', function() {
			$(this).show().animate({
				opacity: 1
			}, 500);
			$('.darken').show().animate({
				opacity: 1
			}, 500);
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
	
		$('.btn-close').on('click', function(event) {
			event.preventDefault;
			close();
		});
		$('.darken').on('click', function(event) {
			close();
		});
	}

	function showStatistics(result, date) {
		$("#user-statistics").find("li:gt(0)").remove();
		for ( var i = 0; i < result.length; i++) {
			var li = $('#user-statistics li.list-head').clone();
			$(li).removeClass('list-head');
			$(li).find('.head-date').text(result[i].activityDate);
			$(li).find('.head-activity').text(result[i].userActivity);
			$(li).appendTo('#user-statistics');
		};
	};

	function close() {
		$('#statisticsModal').animate({
			opacity: 0
		}, 500, function() {
			$(this).hide();
		});
		$('.darken').animate({
			opacity: 0
		}, 500, function() {
			$(this).hide();
		});
	};
}
