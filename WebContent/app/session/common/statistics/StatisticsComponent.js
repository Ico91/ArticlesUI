/**
 * Controls user statistics
 * 
 * @author Galina Hristova
 * @returns
 */
function StatisticsComponent(context) {
	var dateStr = {};
	var activity = 'ALL';
	var paginationComponent = {};

	/**
	 * Initialize modal window which displays user statistics
	 */
	this.init = function(config) {
		var controller = this;
		dateStr = '';
		activity = 'ALL';
		
		$(config.container).load('app/session/common/statistics/statistics.html', function() {
			bind(config);
			$('.statistics-head').html(config.renderItem(config.item));
			paginationComponent = new PaginationComponent(controller);
			paginationComponent.init({
					selector: config.container + ' .statistics-pages',
					url: config.url,
					listContainer : config.container + ' .user-statistics',
					listElement : '.list-element',
					renderItem : config.renderItem
			});
		});
	};

	/**
	 * Add listeners to buttons
	 */
	function bind(config) {
		$(config.container + " .datepicker").datepicker({
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

		$(config.container + ' .activity').change(function() {
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
}