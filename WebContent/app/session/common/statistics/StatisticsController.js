/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsController(context) {
	var thisController = this;
	var statisticsList = [];
	var dateStr = {};
	var activity = 'ALL';
	var statisticsURL = '';
	var container = {};
	var paginationController = {};
	var controller = context;

	/**
	 * Initialize modal window which displays user statistics
	 */
	this.init = function(url, element) {
		dateStr = '';
		activity = 'ALL';
		
		statisticsURL = url;
		container = element;
		
		$(container).load('app/session/common/statistics/statistics.html', function() {
			bind();
			ServerRequest.getScript("app/session/common/pagination/PaginationController.js", paginationInit);
		});
	};
	
	function paginationInit() {
		paginationController = new PaginationController(thisController);
		paginationController.init({
				selector: container + ' .statistics-pages',
				url: statisticsURL
		});
	}

	/**
	 * Visualizes the returned from the server statistics.
	 */
	this.show = function(response) {
		listStatistics(response);
		var list = $(container + " .user-statistics");
		list.find("li:gt(1)").remove();
		var listElement = {};
		listElement = $(container + ' .user-statistics li.' + controller.statisticsElements.element).clone();
		listElement.removeAttr('style');
		listElement.removeClass(controller.statisticsElements.element);
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