/*!
* jQuery pageNav plugin
* Author: @kvnhck
*/

; (function ($, window, document, undefined) {

	var pluginName = 'pageNav';
	var defaults = {
			container: "",
			insertTopLinkAfterHeading: false
		};

	function pageNav(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	pageNav.prototype.init = function () {
		var root = this;
		
		var navcontainer = $(this.options.container);
		navcontainer.append("<ul></ul>");

		var headingcontainter = $(this.element);
		
		var i = 1;

		headingcontainter.find("h1,h2,h3,h4,h5,h6").each(function () {
			var headingClass = "heading_for_index_" + i;
			var indexId = "index_for_heading_" + i;

			//add class to heading
			$(this).addClass(headingClass);
				
			//add link to index after heading
			if(root.options.insertTopLinkAfterHeading)
			{
				$(this).after('<a href="#">index</a>')
					.click(function() {
						root.goTo(navcontainer, 1000);
					});
			}

			//add list item to index
			navcontainer.find("ul").append('<li><a href="#" id="' + indexId + '">' + $(this).text() + '</a></li>');
				
			//assign click event
			$("#" + indexId).click(
				function () {
					root.goTo($("." + headingClass), 500);
				});

			i++;
		});
	};

	pageNav.prototype.goTo = function(element, duration) {
		//scroll
		var x = element.offset().top - 10;
		$("html,body").animate({ scrollTop: x }, duration);

		//TODO? - briefly highlight
		//element.animate({});
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new pageNav(this, options));
			}
		});
	};

})(jQuery, window, document);