// Setup: Author creates contract with 4k ether
var DATA_FEED = 'crypsyfeed'
var DATA_INDEX = 'USD/ETH'
var AUTHOR = 'myWallet'

// if enough to run
if (tx.value < 200 * block.basefee) {
    return //("Insufficient fee")
}
// if not initialized
if (!contract.storage[1000]) {
    // must send 1000 ether
    if (tx.value < 1000) {
        return //("Insufficient value")
    }
    // set as initialized
    contract.storage[1000] = 1
    // store the initial investment in USD, minus a fee, via the exchange rate held at block.contract_storage(DATA_FEED)[DATA_INDEX]
    // D is the contract address for the data feed, I is the datastore index for the latest ethereum-USD exchange rate
    contract.storage[1001] = tx.value * 0.998 * block.contract_storage(DATA_FEED)[DATA_INDEX]
    // store the date (in seconds) at which the contract matures (1 month)
    contract.storage[1002] = block.timestamp + 30 * 86400
    // store the investor wallet address
    contract.storage[1003] = tx.sender
} else {
    // convert initial investment back into ether at current exchange rate
    var ethervalue = contract.storage[1001] / block.contract_storage(DATA_FEED)[DATA_INDEX]
    // if ether value is over 5k, send all to investor (at anytime)
    // or if time expired, send value to investor and remainder to contract author (A)
    if (ethervalue >= 5000) {
        mktx(contract.storage[1003], 5000, 0, 0)
    } else if (block.timestamp > contract.storage[1002]) {
        mktx(contract.storage[1003], ethervalue, 0, 0)
        mktx(AUTHOR, (5000 - ethervalue), 0, 0)
    }
}