const yo = require('yo-yo')
const onload = require('on-load')
const nanoraf = require('nanoraf')
const insertCss = require('insert-css')
const resizeEvent = require('element-resize-detector')({ strategy: 'scroll' })

insertCss(`
  .dom-minimap-section {
    position: absolute;
    background-color: lightgrey;
    overflow: hidden;
    color: grey;
    font-size: 11px;
    padding-left: 2px;
    border-radius: 2px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .dom-minimap-section:hover {
    background-color: #e6e6e6;
  } 
`)

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
  opts.position = opts.position !== false // default true
  
  var lastContainerHeight
  var container
  var element = document.createElement('div')
  element.style.flex = '1'

  const render = nanoraf(renderMap.bind(null, element))
  var state = { opts: opts } 

  onload(element, function load () {
    container = typeof opts.container === 'string' ? document.getElementById(opts.container) : opts.container 
    lastContainerHeight = container.scrollHeight
    container.addEventListener('scroll', function containerScroll () {
      update({ scroll: getScroll(container) })
    })
    update({ sections: getSections(container, opts), scroll: getScroll(container) })
  })
  
  function update (partialState) {
    var newState = Object.assign({}, state, partialState)
    render(newState, state)
    state = newState
  }

  return function () {
    if (container) {
      setTimeout(function () { 
        if (lastContainerHeight !== container.scrollHeight) {
          update({ sections: getSections(container, opts) })
        }
      },1)
    }

    return element
  }
}

function renderMap (element, state) {
  content = yo`<div style="margin-top:20px;text-align:center">loading</div>`
  if (state.sections) {
    content = state.sections.map((section) => {
      return yo`
        <div class="dom-minimap-section unselectable" onclick=${section.scrollTo} style="top:${section.top};bottom:${section.bottom};left:5px;right:5px;">${section.title}</div>
      `
    }).concat([
      yo`<div style="pointer-events:none;position:absolute;background-color:rgba(0,0,0,0.15);top:0;left:0;right:0;bottom:${state.scroll.topFromBottom}"></div>`,
      yo`<div style="pointer-events:none;position:absolute;background-color:rgba(0,0,0,0.15);bottom:0;left:0;right:0;top:${state.scroll.bottomFromTop}"></div>`
    ])
  }

  yo.update(element, yo`<div style='position:relative;height:100%'>${content}</div>`)
}

function getScroll (container) {
  var top = container.scrollTop
  var cHeight = container.clientHeight
  var height = container.scrollHeight
  
  return {
    topFromBottom: ((height - top) / height * 100) + '%',
    bottomFromTop: ((1 - ((height - top - cHeight) / height)) * 100) + '%'
  }
}

function getSections (container, opts) {
  var cHeight = container.scrollHeight
  var cBounds = container.getBoundingClientRect()
  console.log(cHeight)
  return opts.sections(container).map((section) => {
    var bounds = section.getBoundingClientRect()
    return {
      scrollTo: ()=>{ container.scrollTop = bounds.top; console.log(bounds.top) },
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
