var Uuid = require('hat')

module.exports = Transaction


function Transaction(opts) {
  if (!(this instanceof Transaction)) return new Transaction(opts)
  this._initialize(opts || {})
}

Transaction.prototype._initialize = function(opts) {
  this.id = opts.id || Uuid()
  this.target = opts.target
  
  this.sender = opts.sender
  this.value = opts.value
  this.fee = opts.fee || 0
  this.data = opts.data || []
  this.datan = opts.datan || this.data.length
}

Transaction.prototype.toJSON = function() {
  return {
    id: this.id,
    target: this.target,
    sender: this.sender,
    value: this.value,
    fee: this.fee,
    data: this.data,
    datan: this.datan,
  }
}