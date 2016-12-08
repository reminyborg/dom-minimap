const yo = require('yo-yo')
const lorem = require('lorem-ipsum')
const randomInt = require('random-int')
const minimap = require('../')

function getTitle (section, size) {
    if(size > 15) { return section.getAttribute('data-section-title')}
}

const map = minimap({ paddingBottom: '2px', title: getTitle })
const width = 90

var el = view()

function view () {
  var content = Array.from(Array(16).keys()).map((index) => lorem({ units: 'paragraphs', suffix: ':', count: randomInt(3, 30) }).split('::'))
  return yo`
    <div>
      <main id="minimap-content" style="position:absolute;top:0;left:0;width:calc(100% - ${width}px);height:100%;overflow-y:scroll">
        <button onclick=${update}>randomize!</button>
        ${content.map((con, index) => yo`<dl class="minimap-section" data-section-tooltip="${'This is section nr. ' + index}" data-section-title="${index}" style="background-color:lightgrey;margin:30px;padding:20px;"><dt>${index}</dt><dd>${con.map((c) => yo`<p>${c}</p>`)}</dd></dl>`)}
      </main>
      <aside style="position:absolute;top:0;left:calc(100% - ${width}px);right:0;height:100%;border-left: solid 1px grey">
        ${map()}
      </aside>
    </div>
  `
}

function update () {
  var newView = view()
  yo.update(el, newView)
}

document.body.appendChild(el)
