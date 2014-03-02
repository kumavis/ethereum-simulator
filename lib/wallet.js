var Uuid = require('hat')

module.exports = Wallet


function Wallet(opts) {
  if (!(this instanceof Wallet)) return new Wallet(opts)
  this._initialize(opts || {})
}

Wallet.prototype._initialize = function(opts) {
  this.id = opts.id || Uuid()
  this.value = opts.value || 0
}