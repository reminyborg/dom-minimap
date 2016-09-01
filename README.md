# dom-minimap 
Simply lovely dom minimap

**Vertical only** (for now)

Use when you have looong pages and want an intuitive way to see where you are and navigate around.

![alt tag](https://raw.githubusercontent.com/reminyborg/dom-minimap/master/dom-minimap.gif)

## Demo
- :steam_locomotive: [example with yo-yo/choo](http://requirebin.com/?gist=5fb5398f612a208b4ca4854183c5c2d2)
- :high_brightness: example with React (coming soon)

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
