// Setup: Author creates contract with 4k ether
var DATA_FEED = 'cryptsyfeed'
var DATA_INDEX = 'USD/ETH'
var AUTHOR = 'myWallet'

// if not initialized
if (!contract.storage['contract_initialized']) {
    // must send 1000 ether
    if (tx.value < 1000) {
        return // Insufficient value
    }
    // set as initialized
    contract.storage['contract_initialized'] = true
    // store the initial investment in USD, minus a fee, via the exchange rate held on the datafeed
    // D is the contract address for the data feed, I is the datastore index for the latest ethereum-USD exchange rate
    contract.storage['initial_investment_usd'] = tx.value * 0.998 * getCurrentUsdEthRate()
    // store the date (in seconds) at which the contract matures (1 month)
    contract.storage['contract_mature_date'] = block.timestamp + 30 * 86400
    // store the investor wallet address
    contract.storage['investor_wallet_addr'] = tx.sender
} else {
    // convert initial investment back into ether at current exchange rate
    var ethervalue = contract.storage['initial_investment_usd'] / getCurrentUsdEthRate()
    // if ether value is over 5k, send all to investor (at anytime)
    // or if time expired, send value to investor and remainder to contract author (A)
    if (ethervalue >= 5000) {
        mktx(contract.storage['investor_wallet_addr'], 5000, 0, 0)
    } else if (block.timestamp > contract.storage['contract_mature_date']) {
        mktx(contract.storage['investor_wallet_addr'], ethervalue, 0, 0)
        mktx(AUTHOR, (5000 - ethervalue), 0, 0)
    }
}

function getCurrentUsdEthRate() {
    return block.contract_storage(DATA_FEED)[DATA_INDEX]
}