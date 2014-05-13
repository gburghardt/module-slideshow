Module.SlideshowModule = function() {

var _zIndex = 1000;

/**
 * class Module.SlideshowModule < Module.Base, Module.IModule
 **/
var SlideshowModule = Module.Base.extend({

	self: {
		_defaultSlideFactory: null,

		getDefaultSlideFactory: function() {
			return this._defaultSlideFactory || (this._defaultSlideFactory = new SlideFactory());
		}
	},

	prototype: {

		KEY_CODE_ESCAPE: 27,
		KEY_CODE_LEFT: 37,
		KEY_CODE_RIGHT: 39,
		KEY_CODE_SPACEBAR: 32,

		captionsEnabled: true,

		currentSlide: null,

		elementStore: {
			elements: {
				disableCaptionsButton: { selector: ".slideshow-tool-captions-off" },
				enableCaptionsButton: { selector: ".slideshow-tool-captions-on" },
				fullScreenNote: { selector: "em.slideshow-fullscreen-note" },
				pauseButton: { selector: ".slideshow-tool-pause" },
				playButton: { selector: ".slideshow-tool-play" },
				slideContainer: { selector: ".slideshow-container" },
				toolbar: { selector: ".slideshow-tools" }
			}
		},

		fullScreenNoteTimer: null,

		options: {
			autoPlay: false,
			delay: 5000,
			fullScreenNoteDelay: 3000,
			loop: true,
			method: null,
			toggleFullScreenDelay: 100,
			url: null,
			view: null,
			zIndex: 0
		},

		playTimer: null,

		slideFactory: null,

		transition: null,

		_ready: function() {
			Module.Base.prototype._ready.call(this);

			this.elementStore.returnNative = true;
			this.transition = this.transition || new ShowHideTransition();
			this.slideFactory = this.slideFactory || SlideshowModule.getDefaultSlideFactory();
			this.playButton().style.display = "";
			this.pauseButton().style.display = "none";
			this._setZIndex(this.options.zIndex || _zIndex++);
			this.handleKeyUp = this.handleKeyUp.bind(this);

			if (this.options.url) {
				this._loadFromUrl();
			}
			else {
				this._createFirstSlide();
			}
		},

		destructor: function(keepElement) {
			if (this.document) {
				this.document.removeEventListener("keyup", this.handleKeyUp, false);
			}

			if (this.playTimer) {
				this._stopSlideshow();
			}

			if (this.fullScreenNoteTimer) {
				this.window.clearTimeout(this.fullScreenNoteTimer);
				this.fullScreenNoteTimer = null;
			}

			this.slideFactory =
				this.currentSlide =
				this.transition =
			null;

			Module.Base.prototype.destructor.call(this, keepElement);
		},

		captionsOff: function click(event, element, params) {
			event.stop();
			this.captionsEnabled = false;
			this.disableCaptionsButton().style.display = "none";
			this.enableCaptionsButton().style.display = "";
			this._setCurrentSlide(this.currentSlide);
		},

		captionsOn: function click(event, element, params) {
			event.stop();
			this.captionsEnabled = true;
			this.disableCaptionsButton().style.display = "";
			this.enableCaptionsButton().style.display = "none";
			this._setCurrentSlide(this.currentSlide);
		},

		enterFullScreen: function click(event, element, params) {
			event.stop();
			this.showFullScreen();
		},

		exitFullScreen: function click(event, element, params) {
			event.stop();
			this.showSmallScreen();
		},

		next: function click(event, element, params) {
			event.stop();
			this._stopSlideshow();
			this._showNextSlide();
		},

		pause: function click(event, element, params) {
			event.stop();
			this._stopSlideshow();
		},

		play: function click(event, element, params) {
			event.stop();
			this._playSlideshow();
		},

		prev: function click(event, element, params) {
			event.stop();
			this._stopSlideshow();
			this._showPrevSlide();
		},

		_createFirstSlide: function() {
			this._loaded();
			this._setCurrentSlide(this.slideFactory.create(this.slideContainer()));

			if (!this.currentSlide) {
				throw new Error("No slides were found");
			}

			if (this.options.autoPlay) {
				this._playSlideshow();
			}
		},

		handleHideFullScreenNote: function() {
			this.fullScreenNote().style.display = "none";
			this.fullScreenNoteTimer = null;
		},

		handleKeyUp: function(event) {
			var keyCode = event.keyCode;

			if (this.KEY_CODE_ESCAPE === keyCode) {
				this.showSmallScreen();
			}
			else if (this.KEY_CODE_LEFT === keyCode) {
				this._stopSlideshow();
				this._showPrevSlide();
			}
			else if (this.KEY_CODE_RIGHT === keyCode) {
				this._stopSlideshow();
				this._showNextSlide();
			}
			else if (this.KEY_CODE_SPACEBAR === keyCode) {
				if (this.playTimer) {
					this._stopSlideshow();
				}
				else {
					this._playSlideshow();
				}
			}
		},

		handleShowNextSlide: function() {
			this._showNextSlide();
			this._playSlideshow();
		},

		_loadFromUrl: function() {
			this._loading(this.slideContainer());

			var url = this.options.url,
			    method = (this.options.method || "GET").toUpperCase(),
			    xhr = new XMLHttpRequest(),
			    self = this,
			    onreadystatechange = function() {
			    	if (this.readyState < 4) {
			    		return;
			    	}
			    	else if (this.status === 200) {
			    		success();
			    	}
			    	else if (this.status >= 400) {
			    		complete();
			    		throw new Error("Request to " + method + " " + url + " failed with status: " + this.status);
			    	}
			    },
			    success = function() {
			    	var type = xhr.getRequestHeader("content-type");

			    	if (/(application|text)\/json/i.test(type)) {
			    		self.render(self.options.view, JSON.parse(xhr.responseText), self.slideContainer())
			    			.done(function() {
			    				self._loaded(self.slideContainer());
			    				complete();
			    			});
			    	}
			    	else if (/test\/html/i.test(type)) {
			    		self.slideContainer().innerHTML = xhr.responseText;
			    		complete();
			    	}
			    },
			    complete = function() {
			    	xhr = self = null;
			    };

			xhr.onreadystatechange = onreadystatechange;
			xhr.open(method, url);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.send(null);
		},

		_playSlideshow: function() {
			this.playButton().style.display = "none";
			this.pauseButton().style.display = "";
			this.playTimer = this.window.setTimeout(this.handleShowNextSlide.bind(this), this.options.delay);
		},

		_setCurrentSlide: function(slide) {
			if (this.currentSlide) {
				this.currentSlide.removeClass("slideshow-current");
			}

			if (this.captionsEnabled) {
				slide.showCaption();
			}
			else {
				slide.hideCaption();
			}

			slide.addClass("slideshow-current");

			this.currentSlide = slide;
		},

		_setZIndex: function(value) {
			this.options.zIndex =
			this.element.style.zIndex =
			this.slideContainer().style.zIndex = value;
			this.fullScreenNote().style.zIndex = value + 1;
		},

		showFullScreen: function() {
			this.fullScreenNote().style.display = "";
			this.element.classList.add("slideshow-fullscreen");
			this._toggleImageUrls("data-fullscreen-src", "data-smallscreen-src");
			this._setZIndex(this.options.zIndex + 100);
			this.document.addEventListener("keyup", this.handleKeyUp, false);
			this.fullScreenNoteTimer = this.window.setTimeout(
				this.handleHideFullScreenNote.bind(this), this.options.fullScreenNoteDelay);
		},

		_showNextSlide: function() {
			if (this.transitioning) {
				return;
			}

			var currentSlide = this.currentSlide,
			    nextSlide = currentSlide.nextSlide();

			if (!nextSlide && this.options.loop) {
				nextSlide = currentSlide.firstSlide();
			}

			if (nextSlide) {
				this._transition(currentSlide, nextSlide, 1);
			}
		},

		_showPrevSlide: function() {
			if (this.transitioning) {
				return;
			}

			var currentSlide = this.currentSlide,
			    prevSlide = this.currentSlide.prevSlide();

			if (!prevSlide && this.options.loop) {
				prevSlide = this.currentSlide.lastSlide();
			}

			if (prevSlide) {
				this._transition(currentSlide, prevSlide, -1);
			}
		},

		showSmallScreen: function() {
			this.window.clearTimeout(this.fullScreenNoteTimer);
			this.fullScreenNoteTimer = null;
			this.element.classList.remove("slideshow-fullscreen");
			this.fullScreenNote().style.display = "none";
			this._toggleImageUrls("data-smallscreen-src", "data-fullscreen-src");
			this._setZIndex(this.options.zIndex - 100);
			this.document.removeEventListener("keyup", this.handleKeyUp, false);
		},

		_stopSlideshow: function() {
			if (this.playTimer) {
				this.playButton().style.display = "";
				this.pauseButton().style.display = "none";
				this.window.clearTimeout(this.playTimer);
				this.playTimer = null;
			}
		},

		_toggleImageUrls: function(newUrlAttr, oldUrlAttr) {
			var images = this.slideContainer().querySelectorAll("img[" + newUrlAttr + "]"),
			    i = 0,
			    length = images.length,
			    self = this,
			    interval = this.options.toggleFullScreenDelay,
			    callback = function() {
			    	images[i].setAttribute(oldUrlAttr, images[i].src);
					images[i].src = images[i].getAttribute(newUrlAttr);
			    	i++;

			    	if (i < length) {
			    		self.window.setTimeout(callback, interval);
			    	}
			    	else {
			    		images = event = element = params = callback = null;
			    	}
			    };

			this.window.setTimeout(callback, interval);
		},

		_transition: function(from, to, direction) {
			if (!this.transition) {
				return;
			}
			else if (this.transitioning) {
				this.transition.stop();
			}

			this.transitioning = true;
			this.transition.start(from, to, direction, function() {
				this.transitioning = false;
				this._setCurrentSlide(to);

				if (this._playTimer) {
					this._playSlideshow();
				}
			}, this);
		}

	}

});

function SlideFactory() {
}

SlideFactory.prototype = {
	constructor: SlideFactory,

	create: function(slideContainer) {
		var slide = null, image = null, caption = null;

		switch (slideContainer.nodeName) {
		case "DL":
			image = slideContainer.querySelector("dt");
			caption = slideContainer.querySelector("dd");
			slide = new DefinitionListSlide(slideContainer, image, caption);
			break;
		case "DIV":
			image = slideContainer.querySelector("a, img");
			caption = slideContainer.querySelector("figcaption");
			slide = new FigureSlide(slideContainer, image, caption);
			break;
		default:
			break;
		}

		return slide;
	}
};

function AbstractSlide(container, image, caption) {
	this.setContainer(container);
	this.setImage(image);
	this.setCaption(caption);
}

AbstractSlide.prototype = {

	caption: null,

	container: null,

	image: null,

	next: null,

	prev: null,

	constructor: AbstractSlide,

	addClass: function(className) {
		this._alterClassName("add", className);
	},

	_alterClassName: function(method, className) {
		this.image.classList[method](className);

		if (this.caption) {
			this.caption.classList[method](className);
		}
	},

	_createNextSlide: function() {
		throw new Error("Not Implemented");
	},

	_createPrevSlide: function() {
		throw new Error("Not Implemented");
	},

	_findNextSibling: function(element, tagNamesRegex) {
		var sibling = element;

		while (sibling = sibling.nextSibling) {
			if (tagNamesRegex.test(sibling.nodeName)) {
				break;
			}
		}

		return sibling;
	},

	_findPrevSibling: function(element, tagNamesRegex) {
		var sibling = element;

		while (sibling = sibling.previousSibling) {
			if (tagNamesRegex.test(sibling.nodeName)) {
				break;
			}
		}

		return sibling;
	},

	firstSlide: function() {
		var slide = this, firstSlide = this;

		while (slide = slide.prevSlide()) {
			firstSlide = slide;
		}

		return firstSlide;
	},

	getTransitionElements: function() {
		throw new Error("Not Implemented");
	},

	hideCaption: function() {
		if (this.caption) {
			this.caption.style.display = "none";
		}

		return this;
	},

	lastSlide: function() {
		var slide = this, lastSlide = this;

		while (slide = slide.nextSlide()) {
			lastSlide = slide;
		}

		return lastSlide;
	},

	nextSlide: function() {
		if (!this.next) {
			this.next = this._createNextSlide();
		}

		return this.next;
	},

	prevSlide: function() {
		if (!this.prev) {
			this.prev = this._createPrevSlide();
		}

		return this.prev;
	},

	removeClass: function(className) {
		this._alterClassName("remove", className);
	},

	setCaption: function(caption) {
		this.caption = caption;
		return this;
	},

	setImage: function(image) {
		this.image = image;
		return this;
	},

	showCaption: function() {
		if (this.caption) {
			this.caption.style.display = "";
		}

		return this;
	},

	setContainer: function(container) {
		this.container = container;
	}

};

var DefinitionListSlide = AbstractSlide.extend({
	prototype: {
		initialize: function(container, image, caption) {
			AbstractSlide.call(this, container, image, caption);
		},

		getTransitionElements: function() {
			return [this.image];
		},

		_createNextSlide: function() {
			var image = this._findNextSibling(this.caption, /DT/),
			    caption = null,
			    slide = null;

			if (image) {
				caption = this._findNextSibling(image, /DD/);
				slide = new DefinitionListSlide(this.container, image, caption);
			}

			return slide;
		},

		_createPrevSlide: function() {
			var captionOrImage = this._findPrevSibling(this.image, /DD|DT/),
			    image = null, caption = null, slide = null;

			if (captionOrImage) {
				if (captionOrImage.nodeName === "DD") {
					caption = captionOrImage;
					image = this._findPrevSibling(caption, /DT/);
					slide = new DefinitionListSlide(this.container, image, caption);
				}
				else {
					image = captionOrImage;
					caption = this._findNextSibling(image, /DD/);
					slide = new DefinitionListSlide(this.container, image, caption);
				}
			}

			return slide;
		}
	}
});

var FigureSlide = AbstractSlide.extend({
	prototype: {
		figure: null,

		initialize: function(container, image, caption) {
			AbstractSlide.call(this, container, image, caption);
		},

		getTransitionElements: function() {
			return [this.figure];
		},

		_alterClassName: function(method, className) {
			this.figure.classList[method](className);
		},

		_createNextSlide: function() {
			var figure = this._findNextSibling(this.figure, /FIGURE/),
			    image = null, caption = null, slide = null;

			if (figure) {
				image = figure.querySelector("a, img");
				caption = figure.querySelector("figcaption");
				slide = new FigureSlide(this.container, image, caption);
			}

			return slide;
		},

		_createPrevSlide: function() {
			var figure = this._findPrevSibling(this.figure, /FIGURE/),
			    image = null, caption = null, slide = null;

			if (figure) {
				image = figure.querySelector("a, img");
				caption = figure.querySelector("figcaption");
				slide = new FigureSlide(this.container, image, caption);
			}

			return slide;
		},

		setCaption: function(caption) {
			AbstractSlide.prototype.setCaption.call(this, caption);
			this.figure = caption.parentNode;
		}
	}
});

function ShowHideTransition() {
}

ShowHideTransition.prototype = {

	callback: null,

	context: null,

	constructor: ShowHideTransition,

	_toggle: function(elements, display) {
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = display;
		}
	},

	start: function(from, to, direction, callback, context) {
		this.callback = callback;
		this.context = context;

		this._toggle(from.getTransitionElements(), "none");
		this._toggle(to.getTransitionElements(), "block");

		callback.call(context, this);
	},

	stop: function() {
		this.callback.call(this.context, this);
	}

};

// Make classes publically available
SlideshowModule.AbstractSlide = AbstractSlide;
SlideshowModule.FigureSlide = FigureSlide;
SlideshowModule.DefinitionListSlide = DefinitionListSlide;
SlideshowModule.SlideFactory = SlideFactory;

return SlideshowModule;

}();
