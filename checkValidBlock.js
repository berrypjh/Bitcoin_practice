const merkle = require("merkle");
const { createHash } = require("./block");

const isValidBlockStructure = (block) => {
  return (
    typeof block.header.version === "string" &&
    typeof block.header.index === "number" &&
    typeof block.header.previousHash === "string" &&
    typeof block.header.timestamp === "number" &&
    typeof block.header.merkleRoot === "string" &&
    typeof block.body === "object"
  );
};

const isValidNewBlock = (newBlock, previousBlock) => {
  if (isValidBlockStructure(newBlock) === false) {
    console.log("Invalid Block Structure");
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    console.log("Invalid Index");
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    console.log("Invalid previousBlock");
    return false;
  } else if (
    (newBlock.body.length === 0 && "0".repeat(64) !== newBlock.header.merkleRoot) ||
    (newBlock.body.length !== 0 && merkle("sha256").sync(newBlock.body).root() !== newBlock.header.merkleRoot)
  ) {
    console.log("Invalid merkleRoot");
    return false;
  }

  return true;
};

module.exports = {
  isValidNewBlock,
};
