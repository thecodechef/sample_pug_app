# Stylus Lightning
This is a small library of Stylus mixins and stylesheets. It's purpose built to include in the [Site Lightning](http://sitelightning.co/) front-end development boilerplate (source code [here](http://github.com/abstracthat/site-lighting)). You might also find it useful on it's own.

Site Lightning uses [Axis](http://axis.netlify.com/) so this library is mostly just extra helpers on top of that.

## Installation
```bash
npm install --save stylus-lightning
```

## Dependency
This library is dependent on using [Axis](https://github.com/jenius/axis) for the `hover-gradient()` mixin. **Important**! Make sure you import Axis first since this library overwrites the buggy `transition()` mixin in Axis.

## Usage
Like other Stylus libraries you need to `use()` it when calling Stylus. Here's an example Gulp config using four other awesome Stylus libraries: [Happy Grid](https://github.com/abstracthat/happy-grid), [Downbeat](https://github.com/abstracthat/downbeat), [Rupture](https://github.com/jenius/rupture) and [Axis](https://github.com/jenius/axis).

```js
var stylus = require('gulp-stylus');
var lib = require('stylus-lightning');
var downbeat = require('downbeat');
var grid = require('happy-grid');
var rupture = require('rupture');
var axis = require('axis');

gulp.task('style', function() {
  gulp.src('styles/main.styl')
    .pipe(stylus({use: [lib(), downbeat(), rupture(), axis(), grid()]}))
    .pipe(gulp.dest('./compiled/css'))
});
```

Then in your `main.styl` just `@import 'lib'`.

## Styles
These two stylesheets add CSS to your output.

### Reset
This is on top of [normalize.css](http://necolas.github.io/normalize.css/) to give a nicer baseline for new styles.

- border box everything
- Improved `font-smoothing` and `text-rendering`
- iOS scrolling and highlight improvements
- html and body height 100%
- overflow-x hidden for `full-width()` mixin
- Reset padding and margin on commonly styled elements
- Unstyled links
- Unstyled buttons: no outlines, backgrounds or borders
- Unstyled hr
- fluid width, responsive media (`max-width 100%`)

### Print
Print styles inspired by [Hartija](https://github.com/vladocar/Hartija---CSS-Print-Framework/blob/master/print.css) with some typography changes. Print styles in a `@media` query so you don' have to worry about it.

## Mixins
Just a few mixins for now.

### Full Width
It's easier to layout your site so that it is contained to a max-width. But sometimes you want a section background to go full width but your content to still be contained. This is a bit of a hack but works great.

```stylus
section.wide
  full-width()
  color black
```

### Hover Gradient
Uses Axis to create a gradient background and style the `:hover` to offset the gradient. Also sets the color to the element's color (or a color you pass) which is important if you are styling an anchor tag. When applied to an element (like `a.button` for instance) with transition `background-position .2s` you get a nice transition.

You can pass up to 4 args but only `background-color` is required.
- background-color
- [color: @color]
- [strength: null] // uses Axis default (10%)
- [offset: -2.5em]

```stylus
a.button
  &.facebook
    hover-gradient #425c9e
```

### Ratio Box
Set a specific ratio for background images and video iframe embeds.

**Example**:
```stylus
.widescreen-video
  ratio-box(16/9)
```

### Transition
This is a reset to fix occassional problems caused by the way Axis caches Nib's transition mixin. Since it's only for vendor prefixing and I use Auto-prefixer I just want transition to work normally.
