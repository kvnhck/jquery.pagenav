/*!
* jQuery pageNav plugin
* Author: @kvnhck
*/

; (function ($, window, document, undefined) {

	var pluginName = 'pageNav';
	var defaults = {
			//settings
			container: "",
			insertTopLinkAfterHeading: false,
			headingClassPrefix: "heading_for_index",
			indexIdPrefix: "index_for_heading",
			scrollTimeout: 500,
			//callback functions
			formatItem: null,
			formatTopLink: null,
			insertTopLink: null,
			itemClicked: null
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
		var navcontainer_ul = navcontainer.find("ul");

		var headingcontainter = $(this.element);
		
		var hIndex = 0;

		headingcontainter.find("h1,h2,h3,h4,h5,h6").each(function () {
			hIndex++;
			
			var headingClass = root.options.headingClassPrefix + "_" + hIndex;
			var indexId = root.options.indexIdPrefix + "_" + hIndex;

			//add class to heading
			$(this).addClass(headingClass);
			
			//add list item to index
			if($.isFunction(root.options.itemFormat))
				navcontainer_ul.append(root.options.itemFormat(this, indexId));
			else
				navcontainer_ul.append(root.formatItem(this, indexId));
				
			//assign click event
			$("#" + indexId).click(
				function () {
					if($.isFunction(root.options.itemClicked)) {
						root.options.itemClicked($("." + headingClass));
					}
					else {
						root.goTo($("." + headingClass), root.options.scrollTimeout);
					}
				});

			//add link to index after heading
			if(root.options.insertTopLinkAfterHeading)
			{
				var topLink = $.isFunction(root.options.formatTopLink)
					? root.options.formatTopLink(this)
					: root.formatTopLink(this);
				
				if(topLink) {
					topLink.click(function() {
							root.goTo(navcontainer, root.options.scrollTimeout);
						});
				
					if($.isFunction(root.options.insertTopLink))
						root.options.insertTopLink(this, topLink);
					else
						$(this).after(topLink);
				}
			}
		});
	};

	pageNav.prototype.goTo = function(element, duration) {
		//scroll
		var x = element.offset().top - 10;
		$("html,body").animate({ scrollTop: x }, duration);
	};
	
	pageNav.prototype.formatItem = function(element, indexId)
	{
		var li = $("<li></li>");
						
		$("<a></a>")
			.attr("id", indexId)
			.attr("href", "#")
			.text($(element).text())
			.appendTo(li);
			
		return li;
	};
	
	pageNav.prototype.formatTopLink = function(element) {
		return $("<a></a>")
			.attr("href", "#")
			.text("index");
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