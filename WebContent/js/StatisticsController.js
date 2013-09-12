/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsController() {
	/**
	 * Initialize modal window which displays user statistics
	 */
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

	/**
	 * Add listeners to buttons
	 */
	function bind() {
		$("#datepicker").datepicker({
			onSelect : function(date) {
				var datestr = "date=" + date;

				request('session/statistics', 'GET', datestr, null, function(result) {
					showStatistics(result);
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
	
	/**
	 * Display statistics as an unordered list. This function generates list
	 * element for every data from the result.
	 * 
	 * @param result -
	 *            statistics which is result from request
	 */
	function showStatistics(result) {
		$("#user-statistics").find("li:gt(0)").remove();
		for ( var i = 0; i < result.length; i++) {
			var li = $('#user-statistics li.list-head').clone();
			$(li).removeClass('list-head');
			$(li).find('.head-date').text(result[i].activityDate);
			$(li).find('.head-activity').text(result[i].userActivity);
			$(li).appendTo('#user-statistics');
		};
	};

	/**
	 * Close the modal window
	 */
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
