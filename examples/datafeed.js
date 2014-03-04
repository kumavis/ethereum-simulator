var FEEDOWNER = 'crypsy.com'

if (tx.sender != FEEDOWNER) {
  return  
}
contract.storage[tx.data[0]] = tx.data[1]