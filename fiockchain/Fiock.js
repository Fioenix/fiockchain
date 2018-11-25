const calculateHash = require("./Fiohash");

function Fiock(index, previousHash, timestamp, data, hash) {
  this.index = index;
  this.previousHash = previousHash.toString(); // The hash of previous block
  this.timestamp = timestamp; // The miliseconds timestamp that the data is created
  this.data = data; // The data
  this.hash = hash.toString();
}

Fiock.prototype.calculateHash = function() {
  return calculateHash(
    this.index,
    this.previousHash,
    this.timestamp,
    this.data
  ).toString();
};

module.exports = Fiock;
