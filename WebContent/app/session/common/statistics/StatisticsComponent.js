/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsComponent(context) {
	var statisticsList = [];
	var dateStr = {};
	var activity = 'ALL';
	var statisticsURL = '';
	var container = {};
	var paginationComponent = {};

	/**
	 * Initialize modal window which displays user statistics
	 */
	this.init = function(url, element) {
		var controller = this;
		dateStr = '';
		activity = 'ALL';
		
		statisticsURL = url;
		container = element;
		
		$(container).load('app/session/common/statistics/statistics.html', function() {
			bind();
			paginationComponent = new PaginationComponent(controller);
			paginationComponent.init({
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
		listElement = $(container + ' .user-statistics li.' + context.statisticsElements.element).clone();
		listElement.removeAttr('style');
		listElement.removeClass(context.statisticsElements.element);
		listElement.addClass('list-data-user');
		
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
				paginationComponent.reload(true, {
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
			paginationComponent.reload(true, {
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