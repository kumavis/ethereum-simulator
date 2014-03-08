// exit if transaction value too low
if (tx.value < block.basefee * 200) {
  return
}
// exit if storage is already in use
if (contract.storage[tx.data[0]]) {
  return
}
// store provided data in provided index
contract.storage[tx.data[0]] = tx.data[1]