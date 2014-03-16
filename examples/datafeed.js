var FEEDOWNER = 'cryptsy.com'

if (tx.sender != FEEDOWNER) {
  return  
}
contract.storage[tx.data[0]] = tx.data[1]