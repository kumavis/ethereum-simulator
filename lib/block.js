var Uuid = require('hat')

module.exports = Block


function Block(opts) {
  if (!(this instanceof Block)) return new Block(opts)
  this._initialize(opts || {})
}

Block.prototype._initialize = function(opts) {
  this.id = opts.id || Uuid()
  this.transactions = opts.transactions || []
  this.newContracts = opts.newContracts || []
  this.runContracts = opts.runContracts || []
}

Block.prototype.toJSON = function() {
  return {
    id: this.id,
    transactions: this.transactions,
    newContracts: this.newContracts,
    runContracts: this.runContracts,
  }
}