# Slideshow Module

The slideshow module gives you an easy way to create slideshows with a variety
of features.

## Features

- Custom transitions from one slide to the next
- Transitions are available for the following JavaScript libraries:
  - jQuery (fade in/out, slide in/out)
  - Mootools (fade in/out, slide in/out)
  - Prototype (fade in/out, slide in/out)
  - Dojo (fade in/out, slide in/out)
  - YUI (fade in/out, slide in/out)
- Flexible markup structure. Currently two basic structures are supported, but
  additional structures can be supported by writing your own Slide class, as
  long as it supports the `Module.SlideshowModule.ISlide` interface.
- Support for custom Slide factories. Implement your own version of
  `Module.SlideshowModule.ISlideFactory` to return your custom `ISlide` objects
  so you can create your own markup structure.
- Controls to navigate the slideshow include:
  - Next slide
  - Previous slide
  - Play slideshow
  - Pause slideshow
  - Enter fullscreen mode
  - Exit fullscreen mode
- Keyboard navigation aids in fullscreen mode:
  - LEFT and RIGHT arrow keys navigate to the previous and next slides
  - ESCAPE exists fullscreen mode
  - The SPACEBAR toggles between playing the slideshow and pausing it
- Dynamically load full sized images when switching to full screen mode, and
  then dynamically switching back to thumbnails when exiting fullscreen mode.
- Loading the slideshow contents via AJAX
  - HTML
  - JSON + render a client side template
- Starter CSS styles and images

## Requirements

### Browser Support

- Internet Explorer 10+
- Firefox
- Chrome
- Safari
- Opera

### JavaScript Dependencies

- [module-base][module-base]
- [module-utils][module-utils]
- [Oxydizr][oxydizr] Front Controller

A simple `bower install` from the command line will download all the external
dependencies.

## Downloading Slideshow Module

Either download this from GitHub, clone the repository or
`bower install module-slideshow`.

## Getting Started

View the demo to see both kinds of slideshows.

If you already use [Foundry][foundry], then you can create slideshows easily:

```html
<div data-modules="Module.SlideshowModule">
	...
</div>
```

There are two supported markup structures for slideshows: Definition Lists and
Figures (HTML5).

### Definition List Slideshows

This markup structure is best suited for browsers that do not support HTML5, and
for which you did not include a pollyfill to support HTML5 tags.

```html
<div class="slideshow" id="slideshow-1">
    <em class="slideshow-fullscreen-note">Press ESCAPE to exit fullscreen mode.</em>
    <dl class="slideshow-container">
        <dt class="slideshow-current">
            <img src="thumbnails/image1.jpg" data-fullscreen-src="full/image1.jpg" alt="">
        </dt>
        <dd class="slideshow-current">
            Caption #1 goes here
        </dd>
        <dt>
            <img src="thumbnails/image2.jpg" data-fullscreen-src="full/image2.jpg" alt="">
        </dt>
        <dd>
            Caption #2 goes here
        </dd>
    </dl>
    <p class="slideshow-tools"><!--
         --><span>Captions:
            <a href="#" data-actions="slideshow1.captionsOn" class="slideshow-tool-captions-on" style="display: none" title="Turn captions on">Off</a>
            <a href="#" data-actions="slideshow1.captionsOff" class="slideshow-tool-captions-off" title="Turn captions off">On</a>
         </span><!--
         --><a href="#" data-actions="slideshow1.prev" class="slideshow-tool-prev" title="Previous Slide"></a><!--
         --><a href="#" data-actions="slideshow1.play" class="slideshow-tool-play" title="Play"></a><!--
         --><a href="#" data-actions="slideshow1.pause" class="slideshow-tool-pause" title="Pause"></a><!--
         --><a href="#" data-actions="slideshow1.next" class="slideshow-tool-next" title="Next Slide"></a><!--
         --><a href="#" data-actions="slideshow1.enterFullScreen" class="slideshow-tool-full" title="Show Full Screen"></a><!--
         --><a href="#" data-actions="slideshow1.exitFullScreen" class="slideshow-tool-small" title="Exit Full Screen"></a><!--
    --></p>
</div>
```

__CSS Styles:__ See `css/slideshow.css` for a starter stylesheet.

### Figure Slideshows

This markup structure uses the semantic `figure` and `figcaption` tags in HTML5:

```html
<div class="slideshow" id="slide-2">
    <em class="slideshow-fullscreen-note">Press ESCAPE to exit fullscreen mode.</em>
    <div class="slideshow-container">
        <figure class="slideshow-current">
            <img src="thumbs/image1.jpg" data-fullscreen-src="full/image1.jpg" alt="">
            <figcaption>Caption #1 goes here</figcaption>
        </figure>
        <figure>
            <img src="thumbs/image2.jpg" data-fullscreen-src="full/image2.jpg" alt="">
            <figcaption>Caption #2 goes here</figcaption>
        </figure>
    </div>
    <p class="slideshow-tools"><!--
         --><span>Captions:
            <a href="#" data-actions="slideshow2.captionsOn" class="slideshow-tool-captions-on" style="display: none" title="Turn captions on">Off</a>
            <a href="#" data-actions="slideshow2.captionsOff" class="slideshow-tool-captions-off" title="Turn captions off">On</a>
         </span><!--
         --><a href="#" data-actions="slideshow1.prev" class="slideshow-tool-prev" title="Previous Slide"></a><!--
         --><a href="#" data-actions="slideshow1.play" class="slideshow-tool-play" title="Play"></a><!--
         --><a href="#" data-actions="slideshow1.pause" class="slideshow-tool-pause" title="Pause"></a><!--
         --><a href="#" data-actions="slideshow1.next" class="slideshow-tool-next" title="Next Slide"></a><!--
         --><a href="#" data-actions="slideshow1.enterFullScreen" class="slideshow-tool-full" title="Show Full Screen"></a><!--
         --><a href="#" data-actions="slideshow1.exitFullScreen" class="slideshow-tool-small" title="Exit Full Screen"></a><!--
    --></p>
</div>
```

__CSS Styles:__ See `css/slideshow.css` for a starter stylesheet.

## Custom Slideshow Markup Structures

If you have an existing HTML structure you want to use, you may create your own
Slide Factory and Slide class. There are two interfaces you will need to
implement in order to do this: `Module.SlideshowModule.ISlide` and
`Module.SlideshowModule.ISlideFactory`.

### The `Module.SlideshowModule.ISlide` Interface

This interface allows you to create your own markup structure for slides. Its
primary responsibility is to allow SlideshowModule to navigate the Document Tree
from one slide to the next using a Linked List, and provide the slide transition
object an array of DOM nodes that should be affected by the transition from one
slide to the next.

A psuedo-code definition of this interface can be found in `src/interfaces.js`.

#### Public Properties

- `caption` (HTMLElement): The DOM node representing the caption for a slide.
  This may be null, since captions are not required.
- `image` (HTMLElement): The DOM node representing the image for a slide. This
  will always have a value, but it may not be an `<img>` tag.

#### Public Methods

- `firstSlide()`: Returns the first slide in this series.
  - Arguments: none
  - Returns: `Module.SlideshowModule.ISlide`
- `lastSlide()`: Returns the last slide in this series
  - Arguments: none
  - Returns: `Module.SlideshowModule.ISlide`
- `nextSlide()`: Returns the next slide in this series
  - Arguments: none
  - Returns: `Module.SlideshowModule.ISlide` or `null` if at the last slide
- `prevSlide()`: Returns the previous slide in this series
  - Arguments: none
  - Returns: `Module.SlideshowModule.ISlide` or `null` if at the first slide
- `getTransitionElements()`: Returns an array of DOM nodes that should be
  acted upon by the slide transition.
  - Arguments: none
  - Returns: `Array<HTMLElement>`
- `setCaption(caption)`: Sets the `caption` property
  - Arguments: `HTMLElement` - The new caption
  - Returns: `undefined`
- `setImage(image)`: Sets the `image` property
  - Arguments: `HTMLElement` - The new image
  - Returns: `undefined`

#### Creating Your Own Slide Class

There is an abstract base class that you can inherit from, which assists in
creating your own slide classes:

```javascript
function MySlide() {
}

MySlide.prototype = Object.create(Module.SlideshowModule.AbstractSlide.prototype);

MySlide.prototype.constructor = MySlide;

MySlide.prototype._createNextSlide = function() {
    // 1. Find the next set of slide elements
    // 2. Create a new instance of MySlide
    // 3. Return the new MySlide instance, or null if no next slide exists
};
MySlide.prototype._createPrevSlide = function() {
    // 1. Find the previous slide element
    // 2. Create a new instance of MySlide
    // 3. Return the new MySlide instance, or null if no previous slide exists
};
MySlide.prototype.getTransitionElements = function() {
    // Return the array of DOM nodes that the transition effect should be applied to
    // e.g. return [this.image, this.caption];
    // or   return [this.caption.parentNode];
};
```

The `AbstractSlide` class provides two utility methods allowing you to easily
traverse the document tree of your slideshow:

- `_findNextSibling(element, nodeNameRegex)`
  - Arguments:
    - `element` (HTMLElement): The element from where to start looking at next
      siblings
    - `nodeNameRegex` (RegExp): A regular expression used to identify the next
      sibling. For instance, if you want the next `<a>` or `<img>`, then you can
      pass `/A|IMG/`.
  - Returns: `HTMLElement` or `null` if no match was found.
- `_findPrevSibling(element, nodeNameRegex)`
  - Arguments:
    - `element` (HTMLElement): The element from where to start looking at
      previous siblings
    - `nodeNameRegex` (RegExp): A regular expression used to identify the
      previous sibling. For instance, if you want the previous `<a>` or `<img>`,
      then you can pass `/A|IMG/`.
  - Returns: `HTMLElement` or `null` if no match was found.

### The `Module.SlideshowModule.ISlideFactory` Interface

This interface is responsible for giving Slideshow Module its first instance of
an object implementing `Module.SlideshowModule.ISlide`. It has one public method
called `create` that must return an `ISlide` object:

- `create(slideContainer)`: Creates a new Slide object implementing
  `Module.SlideshowModule.ISlide`
  - Arguments: `slideContainer` (HTMLElement) - The DOM node containing all the
    slides.
  - Returns: `Module.SlideshowModule.ISlide`

You can roll your own SlideFactory using this as a guide:

```javascript
function MySlideFactory() {
}

MySlideFactory.prototype = Object.create(Module.SlideshowModule.SlideFactory.prototype);

MySlideFactory.prototype.constructor = MySlideFactory;

MySlideFactory.prototype.create = function(slideContainer) {
    var slide = null;

    switch (slideContainer.nodeName) {
    case "LI":
        slide = new MySlide();
        slide.setImage( /* find slide image */);
        slide.setCaption( /* find slide caption */ );
        break;
    default:
        slide = Module.SlideshowModule.SlideFactory.prototype.create.call(this, slideContainer);
    }

    return slide;
}
```

Now this is where your new Slide class and the Slideshow Module meet:

```javascript
var slideshow = new Module.SlideshowModule();
slideshow.slideFactory = new MySlideFactory();
slideshow.init("html_tag_id", { /* options */ });
```

## Instantiating Slideshow Objects

First, you will need a "front controller" to handle the DOM events, like
[Oxydizr][oxydizr]. Then you'll need to instantiate a new
`Module.SlideshowModule` object and initialize it:

```javascript
// Create the "front controller"
var frontController = new Oxydizr.FrontController()
    .init(document.documentElement);

// Create the slideshow object
var slideshow = new Module.SlideshowModule()
    .init("slideshow-1", {
        autoPlay: true
    });

// Register the slideshow with the front controller
frontController.registerController(slideshow);
```

### Slideshow Options

There are a slew of options allowing you to configured each slideshow
differently, and affect its performance.

- `autoPlay` (Boolean): Start cycling through all the slides as soon as the
  slideshow is initialized. Defaults to `false`.
- `delay` (Number): Number of milliseconds before switching to the next slide
- `fullScreenNoteDelay` (Number): Upon entering Full Screen mode, a not
  informing the user they can press the ESCAPE key to exit full screen mode will
  appear overlayed on the image for this number of milliseconds.
- `loop` (Boolean): When try, clicking "Next" on the last slide cycles back to
  the first slide, and clicking "Previous" on the first slide cycles forward to
  the last slide. When false, nothing happens if you are at the beginning and
  click "Previous", or at the end and click "Next".
- `method` (String): The HTTP request method when filling the slideshow via
  AJAX. Defaults to "GET".
- `toggleFullScreenDelay` (Number): Number of milliseconds that should elapse
  before setting slideshow images to their full size URLs when entering Full
  Screen mode.
- `url` (String): The HTTP URL used to fill the slideshow via AJAX. Defaults to
  null, meaning this module assumes the contents of the slideshow exist on page
  load.
- `view` (String): The name of a client side view to render if the AJAX response
  is valid JSON and the "content-type" HTTP response header is
  `application/json` or `test/json`.
- `zIndex`: A custom CSS z-index to allow proper layering of slideshows when
  entering Full Screen mode. A z-index is auto generated. If slideshows are
  appearing over top of one another, use this to override the default z-index.

## Slide Transitions

The transition from one slide to the next is configurable. By default, a simple
show/hide is done. If you have another JavaScript library, you can include
another JavaScript class to create cross fades, or a sliding effect.

Supported Transitions:

- Cross Fade
  - Dojo: `src/module/slideshow_module/dojo_cross_fade_transition.js`
  - jQuery/Zepto: `src/module/slideshow_module/jquery_cross_fade_transition.js`
  - Mootools: `src/module/slideshow_module/mootools_cross_fade_transition.js`
  - Prototype/Scriptaculous: `src/module/slideshow_module/prototype_cross_fade_transition.js`
  - YUI: `src/module/slideshow_module/yui_cross_fade_transition.js`
- Slide
  - Dojo: `src/module/slideshow_module/dojo_slide_transition.js`
  - jQuery/Zepto: `src/module/slideshow_module/jquery_slide_transition.js`
  - Mootools: `src/module/slideshow_module/mootools_slide_transition.js`
  - Prototype/Scriptaculous: `src/module/slideshow_module/prototype_slide_transition.js`
  - YUI: `src/module/slideshow_module/yui_slide_transition.js`

To use one of these transitions, include the source file on your Web page, and
then set the `transition` property on the slideshow module before calling the
`init` method:

```javascript
var slideshow = new Module.SlideshowModule();
slideshow.transition = new Module.SlideshowModule.jQueryCrossFadeTransition();
slideshow.init("html_tag_id", { /* options */ });
```

### Creating Custom Slide Transitions

The `Module.SlideshowModule.ITransition` interface is used to create your own
slide transitions. It has two public methods:

- `start(from, to, callback[, context])`: Start the transition from one slide to
  the next
  - Arguments:
    - `from` (Module.SlideshowModule.ISlide): The slide you are transitioning from
    - `to` (Module.SlideshowModule.ISlide): The slide you are transitioning to
    - `callback` (Function): A function to execute when the transition is complete
    - `context` (Object): The optional value of `this` in the callback. Defaults to the transition object itself.
- `stop()`: Stops the transition in progress
  - Arguments: none
  - Returns: `undefined`

The pseudo-code for this interface can be found in `src/interfaces.js`.

[module-base]: https://github.com/gburghardt/module-base
[module-utils]: https://github.com/gburghardt/module-utils
[oxydizr]: https://github.com/gburghardt/oxydizr
[foundry]: https://github.com/gburghardt/foundry
