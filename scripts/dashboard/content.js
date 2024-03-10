/**
 * Add elements to the form to allow saving of graphs.
 *
 *
 */
class PageEnhancer {
  constructor() {
    this.banner = this.prepareBanner()
    this.buttons = []
    this.addPanelToggleIcon()
    // TODO: this is a real method
    this.injectKeepButton()
    this.injectRangeSelect()
    EM.apply()
    // Add compare buttons to base of graph
  }

  injectRangeSelect() {
    const localISO = d => {
      const tzoffset = (d.getTimezoneOffset() * 60000)
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
      return localISOTime
    }
    const shiftDay = n => {
      II(`Shifting day by [${n}]`)
      const oldStart = $('#startcurr').val().split(' ')
      const oldEnd = $('#endcurr').val().split(' ')
      const d1 = new Date(oldStart[0] + 'T12:00:00')
      const d2 = new Date(oldEnd[0] + 'T12:00:00')
      const n1 = new Date(oldStart[0] + 'T12:00:00')
      const n2 = new Date(oldEnd[0] + 'T12:00:00')
      n1.setDate(d1.getDate() + n)
      n2.setDate(d2.getDate() + n)
      const newStart = n1.toISOString().substring(0, 10) + ' ' + oldStart[1]
      const newEnd = n2.toISOString().substring(0, 10) + ' ' + oldEnd[1]
      $('#startcurr').val(newStart)
      $('#start').val(newStart)
      $('#endcurr').val(newEnd)
      $('#end').val(newEnd)
    }
    // ${EM.button('&larr;d', 'a-day-earlier', shiftDay.bind(null, -1))}
    const d = $(`<div id="range-fillers">
      <button>&larr;d</button>
      <button>d</button>
      <button>d&rarr;</button>
    </div>`)
    d.insertBefore($('#time-form'))

    $(document).on('click', `#range-fillers > button:nth-child(1)`, shiftDay.bind(null, -1))
    $(document).on('click', `#range-fillers > button:nth-child(2)`, () => {
      const newStart = localISO(new Date()).substring(0, 10) + ' 00:00'
      const newEnd = localISO(new Date()).substring(0, 10) + ' 23:59'
      $('#startcurr').val(newStart)
      $('#endcurr').val(newEnd)
      $('#start').val(newStart)
      $('#end').val(newEnd)
    })
    $(document).on('click', `#range-fillers > button:nth-child(3)`, shiftDay.bind(null, 1))
  }

  prepareBanner() {
    const b = $(`<div id="ml-monitor-header">
      <button id="close-ml-mon">x</button>
      <div id="monitor-area">
        <h1>ML MONITOR MANAGER ON</h1>
          <div id="graphStore">
            <div id="stored" />
          </div>
        </div>
      </div>`)
    b.insertAfter('body')
    b.css({
      padding: '10px',
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      left: '0',
      // 'text-align': 'center'
    })
    $(document).on('click', `#close-ml-mon`, () => {
      $('#ml-monitor-header').hide()
      $('body').css({
        'overflow-y': 'scroll'
      })
    })
    // When opening, render all the images
    $(document).on('click', `#open-ml-mon`, () => {
      const s = $('#ml-monitor-header #stored')
      $('body').css({ overflow: 'hidden' })
      const chartIds = Object.keys(localStorage)
        .sort()
        .filter(x => x.startsWith('chart_'))
      s[0].innerHTML = chartIds
        .map((c, i) => {
          const data = JSON.parse(localStorage[c])
          const id = `button_delete_${c}`
          $(document).on('click', `#${id}`, () => {
            II(`Hiding parent of node [${id}]`)
            $($(`#${id}`)[0].parentNode).hide()
            II(`Trigger delete request for graph [${c}]`)
            b.trigger('delete-graph', c)
          })
          const parts = c.split('_').slice(1)
          const x = parts[1]
          const y = parts[1].substring(12)
          const from = x.substring(0, 4) + '-' + x.substring(4, 6) + '-' + x.substring(6, 8) + ' ' + x.substring(8, 10) + ':' + x.substring(10, 12)
          const to = y.substring(0, 4) + '-' + y.substring(4, 6) + '-' + y.substring(6, 8) + ' ' + y.substring(8, 10) + ':' + y.substring(10, 12)
          return `<div class="graph-holder">
            <button id="${id}" class="btn-delete-graph">x</button>
            <label>${parts[0]}/${from} &rarr; ${to}</label>
            ${data}
          </div>`
        })
        .join('\n')
      // dynamically set width if possible
      try {
        const x = localStorage[Object.keys(localStorage).filter(x => x.startsWith('chart_')).shift()]
        const width = `${+(x.match(/width: (\d.+?)px;/g)[0].match(/\d+/).shift()) + 15}px`
        $('#monitor-area').css({  width  })
      } catch(e) {}
      $('#ml-monitor-header').show()
    })
    b.hide()
    return b
  }

  // panel reveal icon shows the panel
  addPanelToggleIcon() {
    $(`<button id="open-ml-mon"><i>mon ami</i></button>`).insertBefore($('#help-icon'))
  }

  // TODO: implement
  injectKeepButton() {
    $('#charts > div > .chart').each((i, h) => {
      setTimeout(() => {
        const bnId = 'save_' + i
        const panel = $(`<div id="${bnId}" class="btn-keep mlm">&roplus;</div>`)
        panel.insertBefore($(h).find('> div:first-child > div:first-child > div:first-child'))
        II(`Registering click event for button [${bnId}].`)
        $(`#${bnId}`).on('click', () => {
          const id = $(`#${bnId}`)[0].parentNode.parentNode.parentNode.id
          this.banner.trigger('keep-graph', id)
        })
      }, 2000)
    })
  }
}

/**
 * Manage the storing of the graphs.
 *
 *
 */
class GraphKeeper {
  static level = 'debug'
  constructor(banner) {
    this.start = $('#startcurr').val()
    this.end = $('#endcurr').val()
    this.banner = banner
    this.setupListener()
    this.drawer = {
      visible: false
    }
  }

  // Add a chart to the pile
  keep(id) {
    const hash = `${id}_${this.start}+${this.end}`
      .replace(/%/g, '').replace(/:/g, '').replace(/\+/g, '')
      .replace(/-/g, '').replace(/ /g, '')
    const chart = $('#' + id)
    if (chart.length) {
      II(`Storing content of chart [${id}] in local storage.`)
      localStorage.setItem('chart_' + hash, JSON.stringify(chart[0].innerHTML))
    } else {
      II(`No chart found to store. Missing [#${id}]`)
    }
  }
  remove(id) {
    if (localStorage.getItem(id)) {
      II(`Deleting chart [${id}]`)
      localStorage.removeItem(id)
    }
  }
  // listen for storage requests
  setupListener() {
    this.banner.on('keep-graph', (el, id) => {
      II(`Request to keep graph [${id}].`)
      this.keep(id)
    })
    this.banner.on('delete-graph', (el, id) => {
      II(`Request to delete graph [${id}].`)
      this.remove(id)
    })
  }
}

$(document).ready(() => {
  const PH = new PageEnhancer()
  new GraphKeeper(PH.banner)
})


// hoisted for brevity
function _msg(prefix, levels = [], message) {
  if (['debug', 'info'].includes(GraphKeeper.level)) console.log(`${prefix}: ${message}`)
}
function II(m) { _msg('II', ['info', 'debug'], m) }
function DD(m) { _msg('DD', ['debug'], m) }