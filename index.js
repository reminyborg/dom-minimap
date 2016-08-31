const yo = require('yo-yo')
const onload = require('on-load')
// const resizeEvent = require('element-resize-event')

module.exports = minimap

function minimap (opts) {
  opts = opts || {}
  opts.sections = opts.sections || ((container) => Array.prototype.slice.call(container.getElementsByClassName('section')))
  opts.title = opts.title || ((section) => section.getAttribute('data-section'))
  var container

  var element = document.createElement('div')
  element.style.flex = '1'

  onload(element, () => {
    container = document.getElementById('minimap-content')
    render()
  })

  function render () {
    var content = 'loading'
    if (container) {
      content = sections(container).map((section) => {
        return yo`<div style="position:absolute;background-color:lightgrey;top:${section.top}%;bottom:${section.bottom}%;left:5px;right:5px;overflow:hidden;color:grey;font-size:10px;padding-left:2px;border-radius:2px">${section.title}</div>`
      })
    }

    yo.update(element, yo`<div style='position:relative;height:100%'>${content}</div>`)
  }

  function sections (container) {
    var cHeight = container.scrollHeight
    var cBounds = container.getBoundingClientRect()
    return opts.sections(container).map((section) => {
      var bounds = section.getBoundingClientRect()
      return {
        top: ((bounds.top - cBounds.top) / cHeight) * 100,
        bottom: (1 - (bounds.bottom - cBounds.top) / cHeight) * 100,
        title: opts.title(section)
      }
    })
  }

  return element
}
