/**
 * Build extension elements in a consistent and controlled way
 *
 *
 */
class ElementMaker {
    static handlers = []
    constructor() { }
    static button(label, id, handler) {
        ElementMaker.handlers.push({ id, handler })
        return $(`<button id="${id}" class="mlm-button">${label}<button>`)
    }
    static apply() {
        ElementMaker.handlers.forEach(h => {
            $(document).on('click', `#${h.id}`, h.handler)
        })
    }
}
const EM = ElementMaker


// hoisted for brevity
function _msg(prefix, levels = [], message) {
    console.log(`${prefix}: ${message}`)
}
function II(m) { _msg('II', ['info', 'debug'], m) }
function DD(m) { _msg('DD', ['debug'], m) }