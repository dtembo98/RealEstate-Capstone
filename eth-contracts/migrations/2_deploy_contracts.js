// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

// Contract MetaData
var tokenName = "Enigma_Token";
var tokenSymbol = "ENT";

module.exports = function (deployer) {
  deployer.deploy(Verifier);
  deployer.deploy(SolnSquareVerifier, Verifier.address, tokenName, tokenSymbol);
};
