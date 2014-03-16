var fs = require('fs')
var Handlebars = require('handlebars')
var Uuid = require('hat')
var innerText = require('./innerText.js')

//
// App Views
//


module.exports = function(settings) {

  var sim = settings.sim

  var animationStack = []

  var appTemplates = prepareTemplates()
  var appElements = prepareDom()

  setTimeout(startAnimation,3000)
  document.onclick = handleClick

  // start on the 'about' section
  renderDetailsSection(appTemplates.about)

  //
  // update view listeners
  //

  sim.on('wallet',handlerForEventDelay(createWalletView))
  sim.on('wallet.update',handlerForEventDelay(updateWalletView))

  function createWalletView(wallet) {
    var el = document.createElement('div')
    el.setAttribute('data-id',wallet.id)
    el.className = 'wallet clickable'
    appElements.wallets.appendChild(el)
    updateWalletView(wallet,el)
  }

  function updateWalletView(wallet,el) {
    // exit if this is a wallet that isnt tracked (e.g. a contract's wallet)
    if (!sim.wallets[wallet.id]) return
    var msg = new String()
    msg += wallet.id
    msg += ' ('+wallet.value+') '
    el = el || document.querySelector('.wallet[data-id="'+wallet.id+'"]')
    el.textContent = msg
    console.log(msg)
  }

  sim.on('contract',handlerForEventDelay(createContractView))
  sim.on('contract.update',handlerForEventDelay(updateContractView))

  function createContractView(contract,wallet) {
    var el = document.createElement('div')
    el.setAttribute('data-id',contract.id)
    el.className = 'contract clickable'
    appElements.contracts.appendChild(el)
    updateContractView(contract,wallet,el)
  }

  function updateContractView(contract,wallet,el) {
    var msg = new String()
    msg += contract.id
    msg += ' ('+wallet.value+')'
    el = el || document.querySelector('.contract[data-id="'+contract.id+'"]')
    el.textContent = msg
    console.log(msg)
  }

  sim.on('block',handlerForEventDelay(createBlockView))

  function createBlockView(block) {
    var msg = new String()
    msg += 'BLOCK: '
    var blockElement = document.createElement('div')
    blockElement.setAttribute('data-id',block.id)
    blockElement.className = 'block'
    blockElement.textContent = msg
    appElements.blocks.appendChild(blockElement)
    // add transactions inside
    block.transactions.map(function(transaction){
      var transactionView = createTransactionView(transaction)
      blockElement.appendChild(transactionView)
    })
    // add created contracts inside
    block.newContracts.map(function(contract){
      var contractView = createContractGenesisView(contract)
      blockElement.appendChild(contractView)
    })
    // add run contracts inside
    block.runContracts.map(function(contract){
      var contractView = createContractRunView(contract)
      blockElement.appendChild(contractView)
    })
    console.log(msg)
  }

  function createTransactionView(transaction) {
    var msg = new String()
    msg += '('+transaction.value+') '
    msg += transaction.sender+' -> '+transaction.target
    var el = document.createElement('div')
    el.setAttribute('data-id',transaction.id)
    el.className = 'transaction clickable'
    el.textContent = msg
    console.log(msg)
    return el
  }

  function createContractGenesisView(contract) {
    var msg = new String()
    msg += '(create) '
    msg += contract.id
    var el = document.createElement('div')
    el.setAttribute('data-id',contract.id)
    el.className = 'contract clickable'
    el.textContent = msg
    console.log(msg)
    return el
  }

  function createContractRunView(contract) {
    var msg = new String()
    msg += '(run) '
    msg += contract.id
    var el = document.createElement('div')
    el.setAttribute('data-id',contract.id)
    el.className = 'contract clickable'
    el.textContent = msg
    console.log(msg)
    return el
  }

  //
  // view utility
  //

  function prepareDom() {

    document.body.innerHTML = appTemplates.app()

    // references to commonly used elements
    var appElements = {
      left: document.getElementById('left'),
      right: document.getElementById('right'),
      bottom: document.getElementById('bottom'),
      walletsWrapper: document.getElementById('wallets'),
      wallets: document.getElementById('wallets'),
      contracts: document.getElementById('contracts'),
      details: document.getElementById('details'),
      controls: document.getElementById('controls'),
      blocks: document.getElementById('blocks'),
    }

    return appElements
  }

  function prepareTemplates() {

    // subviews
    Handlebars.registerPartial('wallets',fs.readFileSync('./templates/wallets.hbs').toString())
    Handlebars.registerPartial('contracts',fs.readFileSync('./templates/contracts.hbs').toString())
    Handlebars.registerPartial('details',fs.readFileSync('./templates/details.hbs').toString())
    Handlebars.registerPartial('controls',fs.readFileSync('./templates/controls.hbs').toString())
    Handlebars.registerPartial('blocks',fs.readFileSync('./templates/blocks.hbs').toString())

    // templates
    var appTemplates = {
      app: Handlebars.compile(fs.readFileSync('./templates/app.hbs').toString()),
      new_transaction: Handlebars.compile(fs.readFileSync('./templates/new_transaction.hbs').toString()),
      new_contract: Handlebars.compile(fs.readFileSync('./templates/new_contract.hbs').toString()),
      new_wallet: Handlebars.compile(fs.readFileSync('./templates/new_wallet.hbs').toString()),
      about: Handlebars.compile(fs.readFileSync('./templates/about.hbs').toString()),
      contract: Handlebars.compile(fs.readFileSync('./templates/contract.hbs').toString()),
      transaction: Handlebars.compile(fs.readFileSync('./templates/transaction.hbs').toString()),
      wallet: Handlebars.compile(fs.readFileSync('./templates/wallet.hbs').toString()),
    }
    return appTemplates
  }

  function renderDetailsSection(template,context) {
    appElements.details.innerHTML = template(context)
  }

  // wraps a callback to create an animation delay
  function handlerForEventDelay(callback) {
    return function() {  
      // if animation delay is enabled, add to animation stack
      if (settings.animatationDelay) {
        animationStack.push([callback,arguments])
      // otherwise just execute immeditaley
      } else {
        callback.apply(null,arguments)
      }
    }
  }

  function startAnimation() {
    setInterval(function() {
      if (animationStack.length) {
        var data = animationStack.shift()
        data[0].apply(null,data[1])
      }
    },500)
  }

  function handleClick(event){
    var classList = event.target.classList
    var id = event.target.getAttribute('data-id')

    if (classList.contains('contract')) {
      var contract = sim.contracts[id]
      renderDetailsSection(appTemplates.contract, contract)
    } else if (classList.contains('transaction')) {
      var transaction = sim.transactions[id]
      renderDetailsSection(appTemplates.transaction, transaction)
    } else if (classList.contains('wallet')) {
      var wallet = sim.wallets[id]
      renderDetailsSection(appTemplates.wallet, wallet)
    } else if (event.target.id === 'button-transaction') {
      renderDetailsSection(appTemplates.new_transaction, {wallets: sim.wallets, contracts: sim.contracts})
    } else if (event.target.id === 'button-contract') {
      renderDetailsSection(appTemplates.new_contract, {wallets: sim.wallets, contracts: sim.contracts})
    } else if (event.target.id === 'button-wallet') {
      renderDetailsSection(appTemplates.new_wallet, {id: Uuid()})
    } else if (event.target.id === 'button-info') {
      renderDetailsSection(appTemplates.about)
    } else if (event.target.id === 'button-submit-transaction') {
      var transactionData = extractNewTransactionData()
      var transaction = sim.createTransaction(transactionData)
      renderDetailsSection(appTemplates.transaction, transaction)
    } else if (event.target.id === 'button-submit-contract') {
      var contractData = extractNewContractData()
      var contract = sim.createContract(contractData)
      renderDetailsSection(appTemplates.contract, contract)
    } else if (event.target.id === 'button-submit-wallet') {
      var walletData = extractNewWalletData()
      var wallet = sim.createWallet(walletData)
      renderDetailsSection(appTemplates.wallet, wallet)
    }
  }

  function extractNewTransactionData() {
    return {
      target: document.getElementById('nt-select-to').value,
      sender: document.getElementById('nt-select-from').value,
      value: +document.getElementById('nt-value').value,
      fee: +document.getElementById('nt-fee').value,
      data: innerText(document.getElementById('nt-data')).split('\n'),
    }
  }

  function extractNewContractData() {
    return {
      author: document.getElementById('nc-select-author').value,
      value: +document.getElementById('nc-value').value,
      fee: +document.getElementById('nc-fee').value,
      js: innerText(document.getElementById('nc-js')),
    }
  }

  function extractNewWalletData() {
    return {
      id: document.getElementById('nw-id').value,
      value: +document.getElementById('nw-value').value,
    }
  }

}