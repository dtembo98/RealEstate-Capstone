// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var SquareVerifier = artifacts.require("Verifier");
var verifierProof = require("../../zokrates/code/square/proof.json");

// - use the contents from proof.json generated from zokrates steps
contract("SquareVerifier", function (accounts) {
  const account_one = accounts[0];

  beforeEach(async function () {
    this.contract = await SquareVerifier.new({ from: account_one });
  });
  // Test verification with correct proof
  it("should verify a correct proof", async function () {
    let result = await this.contract.verifyTx(
      verifierProof.proof.a,
      verifierProof.proof.b,
      verifierProof.proof.c,
      verifierProof.inputs,
      { from: account_one }
    );
    let eventName = result.logs[0].event;
    assert.equal(eventName, "Verified", "Verification failed");
  });
  // Test verification with incorrect proof
  it("should not verify an incorrect proof", async function () {
    let isVerified = await this.contract.verifyTx.call(
      verifierProof.proof.c,
      verifierProof.proof.b,
      verifierProof.proof.a,
      verifierProof.inputs,
      { from: account_one }
    );
    console.log("isVerified", isVerified);
    assert.equal(isVerified, false, "Verification failed");
  });
});
