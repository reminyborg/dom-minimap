const yo = require('yo-yo')
const lorem = require('lorem-ipsum')
const randomInt = require('random-int')
const minimap = require('../')

const map = minimap({ paddingBottom: '2px' })
const width = 90

var content = Array.from(Array(10).keys()).map((index) => lorem({ units: 'paragraphs', suffix: ':', count: randomInt(1, 23) }).split('::'))
var view = yo`
  <div>
    <main id="minimap-content" style="position:absolute;top:0;left:0;width:calc(100% - ${width}px);height:100%;overflow-y:scroll">
      ${content.map((con, index) => yo`<dl class="minimap-section" data-minimap-title="${index}" style="background-color:lightgrey;margin:30px;padding:20px;"><dt>${index}</dt><dd>${con.map((c) =>yo`<p>${c}</p>`)}</dd></dl>`)}
    </main>
    <aside style="position:absolute;top:0;left:calc(100% - ${width}px);right:0;height:100%;border-left: solid 1px grey">
      ${map}
    </aside>
  </div>
`

document.body.appendChild(view)
