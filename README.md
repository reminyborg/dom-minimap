# dom-minimap 
[![npm version][2]][3] [![downloads][8]][9] [![js-standard-style][10]][11]

Simply lovely dom minimap

**Vertical only** (for now)

Use when you have looong pages and want an intuitive way to see where you are and navigate around.

![alt tag](https://raw.githubusercontent.com/reminyborg/dom-minimap/master/dom-minimap.gif)

## Demo
:steam_locomotive: [example with yo-yo/choo](http://requirebin.com/?gist=5fb5398f612a208b4ca4854183c5c2d2)

:high_brightness: [example with React](http://requirebin.com/?gist=d1f74fd4942dc1ffa0c91b54809a3f0e)

## Usage
You can easily add minimap to existing dom structures, by hooking on to existing id, classes or adding your own.
```html
<main id="content">
  <div class="section" data-title="1">Lorem<div>
  <div class="section" data-title="2">Ipsum<div>
  <div class="section" data-title="3">Gotsum<div>
</main>
<aside id="minimap"></aside>
```

```js
const Minimap = require('dom-minimap')

var minimap = Minimap({ content: 'content', sections: 'section', title: 'data-title' })

var el = minimap()
document.getElementById('minimap').appendChild(el)

// now... call this everytime you think that your content might have changed. Its ok... its cheap.
minimap()

```

## Options
```js
// Defaults:
{
  content: 'minimap-content' // id of element containing sections, or the element directly
  sections: 'minimap-section' // css class used for finding sections, or a function (containerElm) => return Array(sections)
  title: 'data-section-title' // element attr containing section title, or a function (sectionElm) => return title
  paddingBottom: 0 // because sometimes you need more then 0.0001 px between sections, put <value>px or <value>%
}
```

[2]: https://img.shields.io/npm/v/dom-minimap.svg?style=flat-square
[3]: https://npmjs.org/package/dom-minimap
[8]: http://img.shields.io/npm/dm/dom-minimap.svg?style=flat-square
[9]: https://npmjs.org/package/dom-minimap
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
