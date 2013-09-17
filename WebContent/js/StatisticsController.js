/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsController(context, userId) {
	var statisticsList = [];
	var dateStr = {};
	var activity = 'ALL';
	var pagesContext = {};
	var currentPage = 1;
	var elementsPerPage = 10;
	var statisticsURL = {};

	/**
	 * Initialize modal window which displays user statistics
	 */
	this.init = function() {
		if(context instanceof UserSessionController) {
			statisticsURL = 'session/statistics';
		}
		else if(context instanceof AdministratorSessionController) {
			statisticsURL = 'statistics';
		}
		else if(context instanceof UserController) {
			statisticsURL = 'statistics/userId';
		}
		$("#statistics").load('statistics.html', function() {
			bind();
			loadStatistics();
		});
	};

	/**
	 * Add listeners to buttons
	 */
	function bind() {
		$("#datepicker").datepicker({
			dateFormat : 'yy/mm/dd',
			onClose : function(date) {
				dateStr = date;
				goToFirstPage();
				loadStatistics();
			},
		});
	
		$('.btn-close').on('click', function(event) {
			event.preventDefault();
			close();
		});
		$('.darken').on('click', function(event) {
			close();
		});

		$('#activity').change(function() {
			activity = $(this).val();
			goToFirstPage();
			loadStatistics();
		});

		$('#statistics-pages').pagination({
			pages: 0,
			cssStyle: 'light-theme',
			onPageClick: function(page) {
				currentPage = page;
				loadStatistics();
			},
			onInit: function() {
				pagesContext = this;
			}
		});
	}

	function loadStatistics() {
		var page = currentPage - 1;
		var requestData = {
			from : page*elementsPerPage,
			to : page*elementsPerPage + elementsPerPage,
		};

		if(activity != 'ALL')
			requestData.activity = activity;
		if($('#datepicker').val() != '')
			requestData.date = dateStr;

		console.log(requestData);
		request(statisticsURL,
				'GET',
				requestData,
				"application/json; charset=utf-8",
				function(result) {
					listStatistics(result);
				}, 
				function(result) {
					console.log("Error loading statistics");
					console.log(result);
				}
		);
	}

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
		show();
		updatePages(response.totalResults);
	}
	
	function show() {
		$("#user-statistics").find("li:gt(1)").remove();
		if ( (context instanceof UserSessionController) ){
			$('#user-statistics').find('.list-head-admin').hide();
			var listElement = $('#user-statistics li.list-head-user').clone();
			listElement.removeClass('list-head-user');
			listElement.addClass('list-data-user');
		}
		else{
			$('#user-statistics').find('.list-head-user').hide();
			var listElement = $('#user-statistics li.list-head-admin').clone();
			listElement.removeClass('list-head-admin');
			listElement.addClass('list-data-admin');
		}
		if (statisticsList.length == 0) {
			listElement.text('No results found!');
			listElement.appendTo('#user-statistics');
			return;
		}
		if (statisticsList instanceof Array) {
			for(var i = 0; i < statisticsList.length; i ++) {
				listElement.find('.head-userid').text(statisticsList[i].userId);
				listElement.find('.head-date').text(statisticsList[i].activityDate);
				listElement.find('.head-activity').text(statisticsList[i].userActivity);
				listElement.appendTo('#user-statistics');
				listElement = listElement.clone();			
			}
		};
	};

	function updatePages(totalResults) {
		var pages = Math.ceil(totalResults / elementsPerPage);
		if(pagesContext.pages > pages && pagesContext.pages == currentPage)
			$('#statistics-pages').pagination('prevPage');
		pagesContext.pages = pages;
		$('#statistics-pages').pagination('redraw');
	}	

	function goToFirstPage() {
		currentPage = 1;
		$('#statistics-pages').pagination('selectPage', 1);
	}
}
