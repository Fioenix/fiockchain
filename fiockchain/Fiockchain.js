var Fiock = require("./Fiock");
var calculateHash = require("./Fiohash");
var SHA256 = require("crypto-js/sha256");

/**
 * Initial and add the first block
 */
function Fiockchain() {
  let data = "I am the first fiock.";
  let timestamp = new Date();
  let hash = calculateHash(0, "0", timestamp, "", data);
  let firstFiock = new Fiock(0, "0", timestamp, data, hash);

  this.chain = [firstFiock];
}

/**
 * Return the last block
 */

Fiockchain.prototype.latest = function() {
  return this.chain[this.chain.length - 1];
};

Fiockchain.prototype.generateNewFiock = function(data) {
  let latestFiock = this.latest();

  let nextIndex = latestFiock.index + 1;
  let prevHash = latestFiock.hash;
  let timestamp = new Date();
  let curHash = calculateHash(nextIndex, prevHash, timestamp, data);

  return new Fiock(nextIndex, prevHash, timestamp, data, curHash);
};

/**
 * Add a new data to the chain
 * @param {Object} data
 */
Fiockchain.prototype.add = function(data) {
  let newFiock = this.generateNewFiock(data);
  let latestFiock = this.latest();
  if (!this.isValidFiock(newFiock, latestFiock)) {
    console.error("Can not add this Fiock");
    return false;
  }

  let newChain = this.chain.slice(0);
  newChain.push(newFiock);

  return this.replaceChain(newChain);
};

/**
 * Validating the integrity of blocks
 * @param {Fiock} The Fiock that want to validate
 * @param {Fiock} The previous Fiock
 */
Fiockchain.prototype.isValidFiock = function(curFiock, prevFiock) {
  if (prevFiock.index + 1 !== curFiock.index) {
    console.error("Invalid index");
    return false;
  } else if (prevFiock.hash !== curFiock.previousHash) {
    console.error("Invalid previous hash");
    return false;
  } else if (curFiock.calculateHash() !== curFiock.hash) {
    console.error(
      "Invalid hash: " + curFiock.calculateHash() + " <> " + curFiock.hash
    );
    return false;
  } else if (curFiock.hash == prevFiock.hash) {
    console.error(
      "The new Fiock is duplicated with Fiock[" + prevFiock.index + "]"
    );
  }
  return true;
};

/**
 * Validating the integrity of chain.
 * All of blocks in chain are not duplicated (include the block data and itself).
 * @param {Fiockchain} The chain that want to validate
 */
Fiockchain.prototype.isValidChain = function(chain) {
  for (var i = 0; i < chain.length; i++) {
    var curFiock = chain[i];
    var curDataHash = SHA256(JSON.stringify(curFiock.data));

    if (i > 0 && !this.isValidFiock(curFiock, chain[i - 1])) return false;

    for (var j = 0; j < chain.length; j++) {
      if (i == j) {
        continue;
      }

      var dataHash = SHA256(JSON.stringify(chain[j].data));
      if (curDataHash == dataHash) {
        console.error(
          "The data of Fiock[" + i + "] is duplicated with Fiock[" + j + "]"
        );
        return false;
      }
    }
  }
  return true;
};

Fiockchain.prototype.replaceChain = function(newFiockchain) {
  if (this.isValidChain(newFiockchain) && newFiockchain.length > this.chain.length) {
    console.log(
      "Received Fiockchain is valid. Replacing current Fiockchain with received Fiockchain."
    );
    this.chain = newFiockchain;
    return true;
  }
  console.error("Received Fiockchain invalid.");
  return false;
};

module.exports = Fiockchain;