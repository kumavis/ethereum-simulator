var fs = require('fs')
var Simulator = require('./index.js').Simulator
var appView = require('./lib/view.js')

sim = new Simulator()

// initialize the view
var viewSetttings = {
  animatationDelay: false,
  sim: sim,
}

appView(viewSetttings)

//
// Begin simulation
//

// name coin

sim.createWallet({
  id: 'myWallet',
  value: 1000,
})

sim.createContract({
  id: 'namecoin',
  cll: fs.readFileSync('./examples/namecoin.cll').toString(),
  js: fs.readFileSync('./examples/namecoin.js').toString(),
})

sim.createTransaction({
  target: 'namecoin',
  sender: 'myWallet',
  value: 200,
  data: [101,'o hai'],
})

// datafeed

sim.createWallet({
  id: 'crypsy.com',
  value: 1000,
})

sim.createContract({
  id: 'crypsyfeed',
  cll: fs.readFileSync('./examples/datafeed.cll').toString(),
  js: fs.readFileSync('./examples/datafeed.js').toString(),
  storage: ['USD/ETH',1000,'BTC/ETH',0.7],
})

sim.createTransaction({
  target: 'crypsyfeed',
  sender: 'crypsy.com',
  value: 10,
  data: [1,1337],
})

// hedge

sim.createWallet({
  id: 'rich',
  value: 90000,
})

sim.createContract({
  id: 'hedge',
  value: 4000,
  cll: fs.readFileSync('./examples/hedge.cll').toString(),
  js: fs.readFileSync('./examples/hedge.js').toString(),
})

// re-enable animation delay so for actions taken by the user
viewSetttings.animatationDelay = true
