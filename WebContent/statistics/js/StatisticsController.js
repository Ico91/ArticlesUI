/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsController(context) {
	var statisticsList = [];
	var dateStr = {};
	var activity = 'ALL';
	var statisticsURL = '';
	var container = {};
	var paginationController = {};

	/**
	 * Initialize modal window which displays user statistics
	 */
	this.init = function(userId) {
		dateStr = '';
		activity = 'ALL';
		var controller = this;
		if(context instanceof UserSessionController) {
			statisticsURL = 'session/statistics';
			container = '#userStatistics';
		}
		else if(context instanceof AdministratorSessionController) {
			statisticsURL = 'statistics';
			container = '#statistics';
		}
		else if(context instanceof UserDetailsController) {
			statisticsURL = 'statistics/' + userId;
			container = '#userStatistics';
		}
		$(container).load('statistics/html/statistics.html', function() {
			bind();
			paginationController = new PaginationController(controller);
			paginationController.init({
					selector: container + ' .statistics-pages',
					url: statisticsURL
			});
		});
	};

	/**
	 * Visualizes the returned from the server statistics.
	 */
	this.show = function(response) {
		listStatistics(response);
		var list = $(container + " .user-statistics");
		list.find("li:gt(1)").remove();
		var listElement = {};
		if ( (context instanceof UserSessionController) ){
			list.find('.list-head-admin').hide();
			listElement = $(container + ' .user-statistics li.list-head-user').clone();
			listElement.removeClass('list-head-user');
			listElement.addClass('list-data-user');
		}
		else{
			list.find('.list-head-user').hide();
			listElement = $(container + ' .user-statistics li.list-head-admin').clone();
			listElement.removeClass('list-head-admin');
			listElement.addClass('list-data-admin');
		}
		if (statisticsList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo(container + " .user-statistics");
			return;
		}
		if (statisticsList instanceof Array) {
			for(var i = 0; i < statisticsList.length; i ++) {
				listElement.find('.head-userid').text(statisticsList[i].username);
				listElement.find('.head-date').text(statisticsList[i].activityDate);
				listElement.find('.head-activity').text(statisticsList[i].userActivity);
				listElement.appendTo(container + " .user-statistics");
				listElement = listElement.clone();			
			}
		};
	};

	/**
	 * Add listeners to buttons
	 */
	function bind() {
		$(container + " .datepicker").datepicker({
			dateFormat : 'yy/mm/dd',
			onClose : function(date) {
				dateStr = date;
				if(activity == 'ALL')
					activity = '';
				paginationController.reload(true, {
					data : {
						date : dateStr,
						activity : activity
					}
				});
			}
		});
	
		$('.btn-close').on('click', function(event) {
			event.preventDefault();
			close();
		});
		$('.darken').on('click', function(event) {
			close();
		});

		$(container + ' .activity').change(function() {
			if($(this).val() == 'ALL') {
				activity = '';
			}
			else {
				activity = $(this).val();
			}
			paginationController.reload(true, {
				data : {
					date : dateStr,
					activity : activity
				}
			});
		});
	}

	/**
	 * If necessary, converts the returned statistics from the server to an array
	 * list.
	 */
	function listStatistics(response) {
		statisticsList.length = 0;
		if(response.userStatisticsDTO != null) {
			if(response.userStatisticsDTO instanceof Array) {
				statisticsList = response.userStatisticsDTO;
			}
			else {
				statisticsList.push(response.userStatisticsDTO);
			}
		}
	}
}