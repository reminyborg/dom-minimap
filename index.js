const yo = require('yo-yo')
const onload = require('on-load')
const nanoraf = require('nanoraf')
// const resizeEvent = require('element-resize-event')

module.exports = minimap

function minimap (opts) {
  opts = opts || {}
  opts.sections = opts.sections || 'minimap-section'
  if (typeof opts.sections !== 'function') {
    var sectionName = opts.sections
    opts.sections = (container) => Array.prototype.slice.call(container.getElementsByClassName(sectionName))
  }
  opts.title = opts.title || 'data-minimap-title'
  if (typeof opts.title !== 'function') {
    var titleName = opts.title 
    opts.title = (section) => section.getAttribute(titleName)
  }
  opts.container = opts.container || 'minimap-content'
  
  var element = document.createElement('div')
  element.style.flex = '1'

  const render = nanoraf(renderMap)
  var state = { element: element, opts: opts } 

  onload(element, () => {
    state.container = typeof opts.container === 'string' ? document.getElementById(opts.container) : opts.container
    update({ container: state.container })
  })
  
  function update (partialState) {
    var newState = Object.assign({}, state, partialState)
    render(newState, state)
    state = newState
  }

  return element
}

function renderMap (state) {
  content = yo`<div style="margin-top:20px;text-align:center">loading</div>`
  if (state.container) {
    content = sections(state).map((section) => {
      return yo`<div style="position:absolute;background-color:lightgrey;top:${section.top};bottom:${section.bottom};left:5px;right:5px;overflow:hidden;color:grey;font-size:11px;padding-left:2px;border-radius:2px">${section.title}</div>`
    })
  }

  yo.update(state.element, yo`<div style='position:relative;height:100%'>${content}</div>`)
}

function sections (state) {
  var container = state.container
  var opts = state.opts
  var cHeight = container.scrollHeight
  var cBounds = container.getBoundingClientRect()
  return opts.sections(container).map((section) => {
    var bounds = section.getBoundingClientRect()
    return {
      top: (((bounds.top - cBounds.top) / cHeight) * 100) + '%',
      bottom: applyPadding(((1 - (bounds.bottom - cBounds.top) / cHeight) * 100) + '%', opts.paddingBottom),
      title: opts.title(section)
    }
  })
}

function applyPadding (value, padding) {
    if (!padding) return value
    return `calc(${value} + ${padding})`
}
