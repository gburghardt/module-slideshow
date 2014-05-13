Module.SlideshowModule.jQuerySlideTransition = function ($) {
	function jQuerySlideTransition() {}

	jQuerySlideTransition.prototype = {
		duration: 1000,

		constructor: jQuerySlideTransition,

		start: function(from, to, direction, callback, context) {
			direction = direction > 0 ? 1 : -1;
			context = context || this;

			var $from = $(from.getTransitionElements()),
			    $to = $(to.getTransitionElements()),
			    container = to.container,
			    distance = container.offsetWidth * direction,
			    done = function() {
			    	$from.css({
			    		left: "",
			    		position: ""
			    	});
			    	$to.css({
						display: "",
			    		left: "",
			    		position: "",
			    		top: "",
			    		width: ""
			    	});
			    	to.showCaption();
			    	from.showCaption();
			    	container.style.overflow = "";
			    	callback.call(context);
			    };

			from.hideCaption();
			to.hideCaption();
			container.style.overflow = "hidden";

			$from.css({
				left: 0,
				position: "relative"
			});

			$to.css({
				display: "block",
				left: distance,
				position: "absolute",
				top: 0,
				width: "100%"
			});

			$from.animate({ left: distance * -1 }, {
				duration: this.duration,
				queue: false
			});

			$to.animate({left: 0}, {
				duration: this.duration,
				queue: false,
				done: done
			});
		},

		stop: function() {
		}
	};

	return jQuerySlideTransition;
}(this.jQuery || this.Zepto);
