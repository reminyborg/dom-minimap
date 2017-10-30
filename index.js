const yo = require('yo-yo')
const onload = require('on-load')
const nanoraf = require('nanoraf')
const insertCss = require('insert-css')
const debounce = require('lodash.debounce')

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
    left: 5px; right: 5px;
  }

  .dom-minimap-section:hover {
    background-color: #e6e6e6;
  }

  .dom-minimap-scroll {
    pointer-events: none;
    position: absolute;
    background-color: rgba(0,0,0,0.15);
    top: 0; left: 0; right: 0; bottom: 0;
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
  opts.scrollThrottle = 6
  opts.title = opts.title || 'data-section-title'
  if (typeof opts.title !== 'function') {
    var titleName = opts.title
    opts.title = (section) => section.getAttribute(titleName)
  }
  opts.tooltip = opts.tooltip || 'data-section-tooltip'
  if (typeof opts.hover !== 'function') {
    var tooltipName = opts.tooltip
    opts.tooltip = (section) => section.getAttribute(tooltipName)
  }
  opts.content = opts.content || 'minimap-content'
  opts.mapStyle = typeof opts.mapStyle !== 'undefined' ? opts.mapStyle : 'height: 100;'
  opts.sectionStyle = opts.sectionStyle || ''
  opts.clickOffset = opts.clickOffset || 0

  var lastContainerHeight
  var container
  var element = document.createElement('div')
  element.style.flex = '1'

  const render = nanoraf(renderMap)
  var state = { opts: opts }

  onload(element, function load () {
    container = typeof opts.content === 'string' ? document.getElementById(opts.content) : opts.content
    lastContainerHeight = container.scrollHeight
    // update on scroll event
    container.addEventListener('scroll', debounce(update, opts.scrollThrottle, { maxWait: opts.scrollThrottle }))
    // update on window resize event
    window.addEventListener('resize', debounce(update), 100)
    // update on element loaded
    update()
  }, null, minimap)

  element.addEventListener('wheel', function (event) {
    if (container) container.scrollTop = container.scrollTop + event.deltaY
  })

  function update () {
    var newState = Object.assign({}, state, {
      sections: getSections(container, element, opts),
      scroll: getScroll(container)
    })
    render(newState, state)
    state = newState
  }

  return function () {
    if (container) {
      setTimeout(function () {
        if (lastContainerHeight !== container.scrollHeight) {
          update()
        }
      }, 1)
    }

    return element
  }

  function scrollTo () {
    var top = this.style.top.slice(0, -1)
    if (top) container.scrollTop = Math.round((container.scrollHeight * top) / 100) + opts.clickOffset
  }

  function renderMap (state) {
    var content = yo`<div style="margin-top:20px;text-align:center">loading</div>`
    if (state.sections) {
      content = state.sections.map((section) => {
        return yo`
          <div class="dom-minimap-section unselectable"
            title=${section.tooltip} onclick=${scrollTo}
            style="top:${section.top};bottom:${section.bottom};${opts.sectionStyle}">
            ${section.title}
          </div>
        `
      }).concat([
        yo`<div class="dom-minimap-scroll" style="bottom:${state.scroll.topFromBottom}"></div>`,
        yo`<div class="dom-minimap-scroll" style="top:${state.scroll.bottomFromTop}"></div>`
      ])
    }
    yo.update(element, yo`<div style='position:relative;${opts.mapStyle}'>${content}</div>`)
  }
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

function getSections (content, map, opts) {
  var cHeight = content.scrollHeight
  var mHeight = map.parentElement.clientHeight
  var cBounds = content.getBoundingClientRect()
  var scrollTop = content.scrollTop
  return opts.sections(content).map((section) => {
    var bounds = section.getBoundingClientRect()
    var top = (bounds.top - cBounds.top + scrollTop) / cHeight
    var bottom = (bounds.bottom - cBounds.top + scrollTop) / cHeight
    return {
      top: top * 100 + '%',
      bottom: applyPadding((1 - bottom) * 100 + '%', opts.paddingBottom),
      title: opts.title(section, (mHeight * bottom) - mHeight * top),
      tooltip: opts.tooltip(section)
    }
  })
}

function applyPadding (value, padding) {
  if (!padding) return value
  return `calc(${value} + ${padding})`
}
