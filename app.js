var Simulator = require('./index.js').Simulator
var setupView = require('./lib/view.js')
var loadData = require('./lib/initialData.js')

var sim = new Simulator()

// set initial view settings
var viewSetttings = {
  animatationDelay: false,
  sim: sim,
}

// initialize the view
setupView(viewSetttings)

// load in initial data
loadData({ sim: sim })

// re-enable animation delay for actions taken by the user
viewSetttings.animatationDelay = true
