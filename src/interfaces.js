/**
 * interface Module.SlideshowModule.ITransition
 *
 * This defines the interface for objects that transition the show from one
 * slide to the next.
 **/
Module.SlideshowModule.ITransition = {
	/**
	 * Module.SlideshowModule.ITransition.start(from, to, callack[, context])
	 * - from (Module.SlideshowModule.ISlide): The slide you are transitioning from
	 * - to (Module.SlideshowModule.ISlide): The slide you are transitioning to
	 * - direction (Number): +1 of going to the next slide, -1 if going to the
	 *                       previous slide.
	 * - callback (Function): The callback function invoked when the transition is complete
	 * - context (Object): Optional value of "this" variable in callback
	 *
	 * Start the transition from one slide to the next. If a transition is
	 * currently in progress, the current transition should be cancelled.
	 **/
	start: function(from, to, direction, callback, context) {},

	/**
	 * Module.SlideshowModule.ITransition.stop()
	 *
	 * Stops the current transition. It should not throw an error if called when
	 * no transition is in progress.
	 **/
	stop: function() {}
};

/**
 * interface Module.SlideshowModule.ISlideFactory
 *
 * This is the interface for creating new slides.
 **/
Module.SlideshowModule.ISlideFactory = {
	/**
	 * Module.SlideshowModule.ISlideFactory.create(slideContainer) -> Module.SlideshowModule.ISlide
	 * - slideContainer (HTMLElement): The HTML element directly containing the slides
	 *
	 * Create a new object supporting the Module.SlideshowModule.ISlide
	 * interface.
	 **/
	create: function(slideContainer) {}
};

/**
 * interface Module.SlideshowModule.ISlide
 *
 * This is the basic interface that all slide objects must implement.
 **/
Module.SlideshowModule.ISlide = {
	/**
	 * Module.SlideshowModule.ISlide.caption -> HTMLElement
	 *
	 * This is the HTML element containing the caption for this slide. This may
	 * be null if no caption exists. For example, the caption for the
	 * Module.SlideshowModule.DefinitionListSlide class is a <dd> tag.
	 **/
	caption: null,

	/**
	 * Module.SlideshowModule.ISlide.container -> HTMLElement
	 *
	 * This is the element that contains all the slides.
	 **/
	container: null,

	/**
	 * Module.SlideshowModule.ISlide.image -> HTMLElement
	 *
	 * This is the HTML element containing the image for this slide. For
	 * example, the image for the Module.SlideshowModule.DefinitionListSlide
	 * class is a <dt> tag.
	 **/
	image: null,

	addClass: function(className) {},

	/**
	 * Module.SlideshowModule.ISlide.firstSlide() -> Module.SlideshowModule.ISlide
	 *
	 * Gets the first slide in this series.
	 **/
	firstSlide: function() {},

	/**
	 * Module.SlideshowModule.ISlide.getTransitionElements() -> Array<HTMLElement>
	 *
	 * Returns an array of HTML elements that must have the transition effect
	 * applied to it when transitioning from one slide to the next.
	 **/
	getTransitionElements: function() {},

	/**
	 * Module.SlideshowModule.ISlide.hideCaption() -> Module.SlideshowModule.ISlide
	 *
	 * Hides the caption if it exists. Returns itself.
	 **/
	hideCaption: function() {},

	/**
	 * Module.SlideshowModule.ISlide.lastSlide() -> Module.SlideshowModule.ISlide
	 *
	 * Gets the last slide in this series.
	 **/
	lastSlide: function() {},

	/**
	 * Module.SlideshowModule.ISlide.nextSlide() -> Module.SlideshowModule.ISlide
	 *
	 * Gets the next slide in the series, or null if no more slides exist.
	 **/
	nextSlide: function() {},

	/**
	 * Module.SlideshowModule.ISlide.prevSlide() -> Module.SlideshowModule.ISlide
	 *
	 * Gets the previous slide in the series, null if at the first slide.
	 **/
	prevSlide: function() {},

	removeClass: function(className) {},

	/**
	 * Module.SlideshowModule.ISlide.setCaption(caption)
	 *
	 * Sets the caption for this slide.
	 **/
	setCaption: function(caption) {},

	/**
	 * Module.SlideshowModule.ISlide.setContainer(container)
	 *
	 * Sets the container for this slide.
	 **/
	setContainer: function(container) {},

	/**
	 * Module.SlideshowModule.ISlide.setImage(image)
	 *
	 * Sets the image for this slide.
	 **/
	setImage: function(image) {},

	/**
	 * Module.SlideshowModule.ISlide.showCaption() -> Module.SlideshowModule.ISlide
	 *
	 * Shows the caption if it exists. Returns itself.
	 **/
	showCaption: function() {}
};
