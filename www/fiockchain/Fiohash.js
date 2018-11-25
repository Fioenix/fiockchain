var SHA256 = require("crypto-js/sha256");
var format = require("date-fns/format");

module.exports = function calculateHash(index, previousHash, timestamp, data) {
  return SHA256(
    index +
      previousHash.toString() +
      format(timestamp, "x") +
      JSON.stringify(data)
  );
};
