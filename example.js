var fs = require('fs')
var Simulator = require('./index.js').Simulator

sim = new Simulator()

sim.on('transaction',function(transaction) {
  var msg = new String()
  msg += 'TX: '
  msg += '('+transaction.value+') '
  msg += transaction.sender+' -> '+transaction.target
  console.log(msg)
})

sim.on('contract',function(contract,transaction) {
  var msg = new String()
  msg += 'CONTRACT: '
  msg += '('+transaction.value+') '
  msg += transaction.sender+' -> '+transaction.target
  console.log(msg)
})

var newContract = sim.createContract({
  id: 'myContract',
  js: fs.readFileSync('./examples/namecoin.js').toString(),
})

var newWallet = sim.createWallet({
  id: 'myWallet',
  value: 1000,
})

sim.createTransaction({
  target: newContract.id,
  sender: newWallet.id,
  value: 200,
  data: [123,1337],
})