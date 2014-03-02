var vm = require('vm')
var extend = require('extend')
var EventEmitter = require('events').EventEmitter
var Contract = require('./contract.js')
var Transaction = require('./transaction.js')
var Wallet = require('./wallet.js')

module.exports = Simulator


function Simulator(opts) {
  if (!(this instanceof Simulator)) return new Simulator(opts)
  this._initialize(opts)
}

Simulator.prototype._initialize = function(opts) {
  this.contracts = {}
  this.wallets = {}
  this.transactions = {}
  extend(this,new EventEmitter())
}

Simulator.prototype.createContract = function(opts) {
  opts.wallet = this.createWallet()
  var newContract = new Contract(opts)
  this.contracts[newContract.id] = newContract
  this.emit('contract',newContract)
  return newContract
}

Simulator.prototype.createTransaction = function(opts) {
  var newTransaction = new Transaction(opts)
  this.transactions[newTransaction.id] = newTransaction
  this.processTransaction(newTransaction)
  return newTransaction
}

Simulator.prototype.createWallet = function(opts) {
  var newWallet = new Wallet(opts)
  this.wallets[newWallet.id] = newWallet
  this.emit('wallet',newWallet)
  return newWallet
}

Simulator.prototype.processTransaction = function(transaction) {
  var targetContract, targetWallet, senderContract, senderWallet

  // determine in sender+Target are contracts or simple wallets
  if (senderContract = this.contracts[transaction.sender]) {
    senderWallet = this.wallets[senderContract.address]
  } else {
    senderWallet = this.wallets[transaction.sender]
  }
  if (targetContract = this.contracts[transaction.target]) {
    targetWallet = this.wallets[targetContract.address]
  } else {
    targetWallet = this.wallets[transaction.target]
  }

  // validate transaction
  var isValid = (true
    && transaction.value > 0
    && transaction.fee >= 0
    && (transaction.value+transaction.fee) <= senderWallet.value
  )
  if (!isValid) throw new Error('Invalid Transaction.')

  // announce activation of transaction
  this.emit('transaction',transaction)

  // exchange values
  senderWallet.value -= (transaction.value + transaction.fee)
  targetWallet.value += transaction.value
  this.emit('wallet.update',senderWallet)
  this.emit('wallet.update',targetWallet)

  // update contracts, trigger contract run
  if (senderContract) {
    this.emit('contract.update',senderContract)
  }
  if (targetContract) {
    this.emit('contract.update',targetContract)
    this.runContract(targetContract, transaction)
  }
}

Simulator.prototype.runContract = function(contract,transaction) {

  // announce activation of contract
  this.emit('contract.activate',contract,transaction)

  var programSrc = '(function(){\n\n\n'+contract.js+'\n\n\n})()'
  vm.runInNewContext(programSrc, {
    contract: {
      storage: contract.storage,
      mem: [],
    },
    tx: {
      sender: transaction.sender,
      value: transaction.value,
      fee: transaction.fee,
      data: transaction.data.slice(),
      datan: transaction.datan,
    },
    block: {
      contract_storage: function(id){ return sim.contracts[id].storage.slice() },
      basefee: 1,
    },
  })
}