if (tx.value < block.basefee * 200) {
  return
}
if (contract.storage[tx.data[0]] || tx.data[0] < 100) {
  return
}
contract.storage[tx.data[0]] = tx.data[1]