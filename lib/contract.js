var Uuid = require('hat')
var Wallet = require('./wallet.js')

module.exports = Contract


function Contract(opts) {
  if (!(this instanceof Contract)) return new Contract(opts)
  this._initialize(opts || {})
}

Contract.prototype._initialize = function(opts) {
  this.id = opts.id || Uuid()
  this.cll = opts.cll
  this.js = opts.js

  this.storage = opts.storage || []
  this.address = opts.wallet.id
}

Contract.prototype.toJSON = function() {
  return {
    id: this.id,
    cll: this.cll,
    js: this.js,
    storage: this.storage,
    address: this.address,
  }
}