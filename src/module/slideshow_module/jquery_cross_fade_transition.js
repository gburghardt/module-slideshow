Module.SlideshowModule.jQueryCrossFadeTransition = function ($) {
	function jQueryCrossFadeTransition() {}

	jQueryCrossFadeTransition.prototype = {

		duration: 1000,

		constructor: jQueryCrossFadeTransition,

		start: function(from, to, direction, callback, context) {
			context = context || this;

			var $to = $(to.getTransitionElements()),
			    $from = $(from.getTransitionElements()),
			    done = function() {
			    	$to.css({
			    		display: "",
			    		opacity: "",
			    		position: "",
			    		top: "",
			    		left: "",
			    		"margin-left": ""
			    	});

					from.showCaption();
					to.showCaption();

					callback.call(context);
			    };

			$to.css({
				display: "block",
				opacity: 0,
				position: "absolute",
				top: 0,
				left: "50%",
				width: "100%"
			}).css("margin-left", $to.width() / 2 * -1);

			from.hideCaption();
			to.hideCaption();

			$from.animate({opacity: 0}, {
				duration: this.duration,
				queue: false
			});

			$to.animate({opacity: 1.0}, {
				duration: this.duration,
				queue: false,
				done: done
			});
		},

		stop: function() {

		}

	};

	return jQueryCrossFadeTransition;

}(this.jQuery || this.Zepto);