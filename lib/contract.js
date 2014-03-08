var Uuid = require('hat')

module.exports = Contract


function Contract(opts) {
  if (!(this instanceof Contract)) return new Contract(opts)
  this._initialize(opts || {})
}

Contract.prototype._initialize = function(opts) {
  this.id = opts.id || Uuid()
  this.js = opts.js

  this.storage = opts.storage || []
  this.wallet = opts.wallet
  this.address = opts.wallet.id
}

Contract.prototype.toJSON = function() {
  return {
    id: this.id,
    js: this.js,
    storage: this.storage,
    address: this.address,
  }
}