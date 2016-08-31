const yo = require('yo-yo')
const lorem = require('lorem-ipsum')
const randomInt = require('random-int')
const minimap = require('../')

var map = minimap()

var content = Array.from(Array(10).keys()).map((index) => lorem({ units: 'paragraphs', suffix: ':', count: randomInt(1, 23) }).split('::'))
var view = yo`
  <div>
    <main id="minimap-content" style="position:absolute;top:0;left:0;width:85%;height:100%;overflow:auto">
      ${content.map((con, index) => yo`<dl class="section" data-section="${index}" style="background-color:lightgrey;margin:30px;margin-bottom:100px;padding:20px;"><dt>${index}</dt><dd>${con.map((c) =>yo`<p>${c}</p>`)}</dd></dl>`)}
    </main>
    <aside style="position:absolute;top:0;left:85%;width:15%;height:100%">
      ${map}
    </aside>
  </div>
`

document.body.appendChild(view)
