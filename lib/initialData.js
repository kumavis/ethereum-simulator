var fs = require('fs')

//
// Create initial contracts and wallets
//

module.exports = function(deps) {

  var sim = deps.sim

  // name coin

  sim.createWallet({
    id: 'myWallet',
    value: 1000,
  })

  sim.createContract({
    id: 'namecoin',
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
    js: fs.readFileSync('./examples/hedge.js').toString(),
  })

}