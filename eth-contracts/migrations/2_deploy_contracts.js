// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

// Contract MetaData
var tokenName = "Enigma_Token";
var tokenSymbol = "ENT";

module.exports = async function (deployer) {
  await deployer.deploy(Verifier);
  await deployer.deploy(
    SolnSquareVerifier,
    Verifier.address,
    tokenName,
    tokenSymbol
  );
};
